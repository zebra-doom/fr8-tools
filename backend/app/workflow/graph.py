"""LangGraph workflow: NL → SQL → Execute → Validate → Fix/Format.

This is the core agentic AI showcase — a multi-node StateGraph with
conditional routing, retry loops, and parallel formatting.
"""

import logging

from langgraph.graph import END, START, StateGraph

from app.agents.chart_agent import generate_chart
from app.agents.map_agent import generate_map
from app.agents.markdown_agent import generate_markdown
from app.agents.sql_fixer import fix_sql
from app.agents.sql_generator import generate_sql
from app.db import execute_query
from app.rag.utils import extract_sql, format_results_for_llm, is_read_only_sql
from app.workflow.state import WorkflowState

logger = logging.getLogger(__name__)

MAX_RETRIES = 2


# ── Node functions ──────────────────────────────────────────────────


async def generate_sql_node(state: WorkflowState) -> WorkflowState:
    """Translate the user's natural language question into SQL."""
    question = state["question"]
    logger.info("Generating SQL for: %s", question)

    raw = await generate_sql(question)
    sql = extract_sql(raw)
    return {"sql_query": sql, "attempt": state.get("attempt", 0) + 1}


async def execute_sql_node(state: WorkflowState) -> WorkflowState:
    """Execute the SQL query against PostgreSQL."""
    sql = state["sql_query"]
    logger.info("Executing SQL (attempt %d): %s", state.get("attempt", 1), sql)

    if not is_read_only_sql(sql):
        return {
            "sql_error": "Query rejected: only SELECT queries are allowed.",
            "query_results": None,
        }

    try:
        results = await execute_query(sql)
        return {"query_results": results, "sql_error": None}
    except Exception as e:
        logger.warning("SQL execution error: %s", e)
        return {"sql_error": str(e), "query_results": None}


async def fix_sql_node(state: WorkflowState) -> WorkflowState:
    """Attempt to fix a failed SQL query using the error message."""
    sql = state["sql_query"]
    error = state.get("sql_error", "Unknown error")
    logger.info("Fixing SQL (attempt %d): %s", state.get("attempt", 1), error)

    raw = await fix_sql(sql, error)
    fixed = extract_sql(raw)
    return {"sql_query": fixed, "attempt": state.get("attempt", 0) + 1}


async def format_response_node(state: WorkflowState) -> WorkflowState:
    """Format successful results into markdown, chart config, and map GeoJSON."""
    question = state["question"]
    results = state.get("query_results") or []
    results_text = format_results_for_llm(results)

    logger.info("Formatting response (%d rows)", len(results))

    md = await generate_markdown(question, results_text)

    # Attempt chart generation (non-critical)
    chart = None
    try:
        if len(results) >= 2:
            chart = await generate_chart(question, results_text)
    except Exception:
        logger.warning("Chart generation failed", exc_info=True)

    # Attempt map generation if results contain coordinates
    map_geojson = None
    try:
        has_coords = results and any(
            "latitude" in r or "longitude" in r for r in results
        )
        if has_coords:
            map_geojson = await generate_map(question, results_text)
    except Exception:
        logger.warning("Map generation failed", exc_info=True)

    return {"markdown": md, "chart": chart, "map_geojson": map_geojson}


# ── Conditional routing ─────────────────────────────────────────────


def route_after_execution(state: WorkflowState) -> str:
    """Decide next step after SQL execution: fix, format, or fail."""
    if state.get("sql_error") is None:
        return "format"
    if state.get("attempt", 0) < MAX_RETRIES:
        return "fix"
    return "fail"


async def fail_node(state: WorkflowState) -> WorkflowState:
    """Terminal node for when all retry attempts are exhausted."""
    error = state.get("sql_error", "Unknown error")
    return {
        "markdown": (
            f"I wasn't able to answer your question. The database query failed "
            f"after {state.get('attempt', 0)} attempts.\n\n"
            f"**Error:** {error}\n\n"
            f"Try rephrasing your question or asking about specific routes, "
            f"terminals, or operators."
        ),
        "chart": None,
        "map_geojson": None,
    }


# ── Graph assembly ──────────────────────────────────────────────────


def build_workflow() -> StateGraph:
    """Build and return the compiled LangGraph workflow."""
    graph = StateGraph(WorkflowState)

    # Add nodes
    graph.add_node("generate_sql", generate_sql_node)
    graph.add_node("execute_sql", execute_sql_node)
    graph.add_node("fix_sql", fix_sql_node)
    graph.add_node("format_response", format_response_node)
    graph.add_node("fail", fail_node)

    # Add edges
    graph.add_edge(START, "generate_sql")
    graph.add_edge("generate_sql", "execute_sql")
    graph.add_conditional_edges(
        "execute_sql",
        route_after_execution,
        {"fix": "fix_sql", "format": "format_response", "fail": "fail"},
    )
    graph.add_edge("fix_sql", "execute_sql")  # Retry loop
    graph.add_edge("format_response", END)
    graph.add_edge("fail", END)

    return graph


workflow = build_workflow().compile()

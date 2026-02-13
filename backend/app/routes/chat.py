"""Chat endpoint with SSE streaming."""

import json
import logging

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse

from app.models import ChatRequest
from app.workflow.graph import workflow

logger = logging.getLogger(__name__)

router = APIRouter()


async def _stream_response(request: ChatRequest):
    """Run the LangGraph workflow and stream results as SSE events."""
    # Extract the latest user message
    user_message = next(
        (m.content for m in reversed(request.messages) if m.role == "user"),
        "",
    )

    if not user_message:
        yield {"event": "error", "data": json.dumps({"error": "No user message provided"})}
        return

    initial_state = {
        "question": user_message,
        "sql_query": "",
        "sql_error": None,
        "query_results": None,
        "attempt": 0,
        "markdown": "",
        "chart": None,
        "map_geojson": None,
        "error_message": None,
    }

    try:
        # Stream node updates from the workflow
        async for event in workflow.astream(initial_state, stream_mode="updates"):
            for node_name, node_output in event.items():
                # Stream SQL generation step
                if node_name == "generate_sql" and "sql_query" in node_output:
                    yield {
                        "event": "sql",
                        "data": json.dumps({"sql": node_output["sql_query"]}),
                    }

                # Stream the formatted response
                if node_name in ("format_response", "fail"):
                    md = node_output.get("markdown", "")
                    if md:
                        # Stream markdown in chunks for a typing effect
                        chunk_size = 50
                        for i in range(0, len(md), chunk_size):
                            yield {
                                "event": "data",
                                "data": json.dumps({"content": md[i : i + chunk_size]}),
                            }

                    # Send chart config if available
                    chart = node_output.get("chart")
                    if chart:
                        yield {"event": "chart", "data": json.dumps(chart)}

                    # Send map GeoJSON if available
                    map_data = node_output.get("map_geojson")
                    if map_data:
                        yield {"event": "map", "data": json.dumps(map_data)}

        yield {"event": "done", "data": json.dumps({"status": "complete"})}

    except Exception as e:
        logger.error("Workflow error: %s", e, exc_info=True)
        yield {
            "event": "error",
            "data": json.dumps({"error": "An internal error occurred. Please try again."}),
        }


@router.post("/chat")
async def chat(request: ChatRequest):
    """Chat endpoint that streams LangGraph workflow results via SSE."""
    return EventSourceResponse(_stream_response(request))

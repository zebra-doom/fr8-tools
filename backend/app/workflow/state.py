"""LangGraph workflow state definition."""

from typing import TypedDict


class WorkflowState(TypedDict, total=False):
    """State that flows through the LangGraph workflow nodes."""

    question: str
    sql_query: str
    sql_error: str | None
    query_results: list[dict] | None
    attempt: int
    markdown: str
    chart: dict | None
    map_geojson: dict | None
    error_message: str | None

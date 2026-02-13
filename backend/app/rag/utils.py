"""Utility functions for RAG processing."""

import re


def extract_sql(text: str) -> str:
    """Extract SQL from LLM response, removing markdown fences if present."""
    # Try to extract from code fences
    match = re.search(r"```(?:sql)?\s*(.*?)```", text, re.DOTALL)
    if match:
        return match.group(1).strip()

    # Remove any leading/trailing whitespace
    cleaned = text.strip()

    # If it starts with SELECT, it's already clean SQL
    if cleaned.upper().startswith("SELECT"):
        return cleaned

    return cleaned


def is_read_only_sql(sql: str) -> bool:
    """Check if SQL is a read-only SELECT query (no mutations)."""
    normalized = sql.strip().upper()
    dangerous = ["INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE", "GRANT"]
    for keyword in dangerous:
        if re.search(rf"\b{keyword}\b", normalized):
            return False
    return normalized.startswith("SELECT") or normalized.startswith("WITH")


def truncate_results(results: list[dict], max_rows: int = 50) -> list[dict]:
    """Truncate query results to a maximum number of rows."""
    return results[:max_rows]


def format_results_for_llm(results: list[dict], max_rows: int = 30) -> str:
    """Format query results as a readable string for LLM consumption."""
    if not results:
        return "No results found."

    truncated = results[:max_rows]
    lines = []
    for i, row in enumerate(truncated):
        lines.append(f"Row {i + 1}: {row}")

    if len(results) > max_rows:
        lines.append(f"... and {len(results) - max_rows} more rows")

    return "\n".join(lines)


def clean_route_hash_key(key: str) -> str:
    """Normalize a route hash key."""
    return key.strip().lower()

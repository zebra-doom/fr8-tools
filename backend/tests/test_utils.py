"""Tests for RAG utility functions."""

from app.rag.utils import extract_sql, is_read_only_sql


def test_extract_sql_plain():
    assert extract_sql("SELECT * FROM trains") == "SELECT * FROM trains"


def test_extract_sql_from_code_fence():
    text = "```sql\nSELECT * FROM trains\n```"
    assert extract_sql(text) == "SELECT * FROM trains"


def test_extract_sql_from_generic_fence():
    text = "```\nSELECT * FROM trains\n```"
    assert extract_sql(text) == "SELECT * FROM trains"


def test_is_read_only_select():
    assert is_read_only_sql("SELECT * FROM trains") is True


def test_is_read_only_with():
    assert is_read_only_sql("WITH cte AS (SELECT 1) SELECT * FROM cte") is True


def test_rejects_delete():
    assert is_read_only_sql("DELETE FROM trains") is False


def test_rejects_drop():
    assert is_read_only_sql("DROP TABLE trains") is False


def test_rejects_insert():
    assert is_read_only_sql("INSERT INTO trains VALUES (1)") is False

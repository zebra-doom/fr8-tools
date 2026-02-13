"""SQL fixer agent: corrects failed SQL queries based on error messages."""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.rag.prompts import SQL_FIX_PROMPT
from app.rag.schema import STATIC_SCHEMA

_prompt = ChatPromptTemplate.from_template(SQL_FIX_PROMPT)
_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0)

sql_fix_chain = _prompt | _llm | StrOutputParser()


async def fix_sql(sql: str, error: str, schema: str | None = None) -> str:
    """Fix a failed SQL query given the error message."""
    return await sql_fix_chain.ainvoke({
        "sql": sql,
        "error": error,
        "schema": schema or STATIC_SCHEMA,
    })

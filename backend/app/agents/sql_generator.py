"""SQL generation agent: translates natural language to PostgreSQL queries."""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.rag.prompts import SQL_GENERATION_PROMPT
from app.rag.schema import STATIC_SCHEMA

_prompt = ChatPromptTemplate.from_template(SQL_GENERATION_PROMPT)
_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0)

sql_generation_chain = _prompt | _llm | StrOutputParser()


async def generate_sql(question: str, schema: str | None = None) -> str:
    """Generate a SQL query from a natural language question."""
    return await sql_generation_chain.ainvoke({
        "question": question,
        "schema": schema or STATIC_SCHEMA,
    })

"""Markdown summary agent: formats query results as readable markdown."""

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.rag.prompts import MARKDOWN_SUMMARY_PROMPT

_prompt = ChatPromptTemplate.from_template(MARKDOWN_SUMMARY_PROMPT)
_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0.3)

markdown_chain = _prompt | _llm | StrOutputParser()


async def generate_markdown(question: str, results: str) -> str:
    """Generate a markdown summary of query results."""
    return await markdown_chain.ainvoke({
        "question": question,
        "results": results,
    })

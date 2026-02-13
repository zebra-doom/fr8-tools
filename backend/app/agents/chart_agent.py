"""Chart agent: generates chart configuration JSON from query results."""

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.rag.prompts import CHART_GENERATION_PROMPT

_prompt = ChatPromptTemplate.from_template(CHART_GENERATION_PROMPT)
_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0)

chart_chain = _prompt | _llm | JsonOutputParser()


async def generate_chart(question: str, results: str) -> dict:
    """Generate a chart configuration from query results."""
    return await chart_chain.ainvoke({
        "question": question,
        "results": results,
    })

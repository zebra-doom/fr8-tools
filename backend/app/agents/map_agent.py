"""Map agent: generates GeoJSON from query results containing coordinates."""

from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.rag.prompts import MAP_GENERATION_PROMPT

_prompt = ChatPromptTemplate.from_template(MAP_GENERATION_PROMPT)
_llm = ChatOpenAI(model=settings.openai_model, api_key=settings.openai_api_key, temperature=0)

map_chain = _prompt | _llm | JsonOutputParser()


async def generate_map(question: str, results: str) -> dict:
    """Generate GeoJSON from query results with coordinates."""
    return await map_chain.ainvoke({
        "question": question,
        "results": results,
    })

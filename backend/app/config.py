from pathlib import Path

from pydantic_settings import BaseSettings

_DEFAULT_DB = str(Path(__file__).resolve().parent.parent / "data" / "fr8tools.db")


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-4o"
    database_path: str = _DEFAULT_DB
    cors_origins: list[str] = ["http://localhost:3000"]
    debug: bool = False

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()

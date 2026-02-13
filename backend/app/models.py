from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    thread_id: str | None = None


class HealthResponse(BaseModel):
    status: str = "ok"


class TerminalResponse(BaseModel):
    uid: str
    name: str
    city: str
    longitude: float
    latitude: float
    country: str


class RouteResponse(BaseModel):
    uid: str
    from_terminal_city: str
    to_terminal_city: str
    from_terminal_country: str
    to_terminal_country: str
    operator_name: str
    distance: float
    transit_time_hours: float
    train_vs_truck_co2e_reduction_percent: float

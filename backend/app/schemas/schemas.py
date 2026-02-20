from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = "user"
    industry: str = "general"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    industry: str

    class Config:
        from_attributes = True


class SessionCreateRequest(BaseModel):
    domain: str = "general"
    workflow: str = "default"


class SessionResponse(BaseModel):
    id: int
    domain: str
    workflow: str
    created_at: datetime

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    session_id: int
    message: str


class Explainability(BaseModel):
    memory_items_used: int
    workflow: str
    reason: str


class ChatResponse(BaseModel):
    reply: str
    sentiment: str
    estimated_cost_cents: int
    explainability: Explainability


class FeedbackRequest(BaseModel):
    session_id: int
    rating: int = Field(ge=1, le=5)
    comments: str = ""


class AnalyticsResponse(BaseModel):
    total_sessions: int
    total_messages: int
    average_feedback_rating: float
    estimated_total_cost_cents: int

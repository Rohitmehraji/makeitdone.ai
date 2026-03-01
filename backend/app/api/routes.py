from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models.models import ChatMessage, ChatSession, Feedback, User
from app.schemas.schemas import (
    AnalyticsResponse,
    ChatRequest,
    ChatResponse,
    Explainability,
    FeedbackRequest,
    LoginRequest,
    RegisterRequest,
    SessionCreateRequest,
    SessionResponse,
    TokenResponse,
    UserResponse,
)
from app.services.agent import call_language_model, classify_sentiment, estimate_cost_cents

router = APIRouter()


@router.post("/auth/register", response_model=UserResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    exists = db.query(User).filter(User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
        industry=payload.industry,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/auth/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": str(user.id), "role": user.role})
    return TokenResponse(access_token=token)


@router.post("/sessions", response_model=SessionResponse)
def create_session(
    payload: SessionCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = ChatSession(user_id=current_user.id, domain=payload.domain, workflow=payload.workflow)
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.post("/chat", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = db.query(ChatSession).filter(ChatSession.id == payload.session_id, ChatSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    memory = db.query(ChatMessage).filter(ChatMessage.session_id == session.id).order_by(ChatMessage.created_at.asc()).all()
    user_sentiment = classify_sentiment(payload.message)

    db.add(
        ChatMessage(
            session_id=session.id,
            role="user",
            content=payload.message,
            sentiment=user_sentiment,
            cost_cents=estimate_cost_cents(payload.message),
        )
    )

    reply = await call_language_model(payload.message, memory, session.workflow, session.domain)
    assistant_sentiment = classify_sentiment(reply)
    cost = estimate_cost_cents(reply)

    db.add(
        ChatMessage(
            session_id=session.id,
            role="assistant",
            content=reply,
            sentiment=assistant_sentiment,
            cost_cents=cost,
        )
    )
    db.commit()

    explainability = Explainability(
        memory_items_used=min(len(memory), 8),
        workflow=session.workflow,
        reason=f"Response grounded on recent context and {session.domain} domain workflow rules.",
    )
    return ChatResponse(reply=reply, sentiment=assistant_sentiment, estimated_cost_cents=cost, explainability=explainability)


@router.post("/feedback")
def submit_feedback(
    payload: FeedbackRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    feedback = Feedback(
        user_id=current_user.id,
        session_id=payload.session_id,
        rating=payload.rating,
        comments=payload.comments,
    )
    db.add(feedback)
    db.commit()
    return {"status": "recorded"}


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics(_: User = Depends(require_admin), db: Session = Depends(get_db)):
    total_sessions = db.query(func.count(ChatSession.id)).scalar() or 0
    total_messages = db.query(func.count(ChatMessage.id)).scalar() or 0
    avg_feedback = db.query(func.avg(Feedback.rating)).scalar() or 0.0
    total_cost = db.query(func.sum(ChatMessage.cost_cents)).scalar() or 0
    return AnalyticsResponse(
        total_sessions=total_sessions,
        total_messages=total_messages,
        average_feedback_rating=round(float(avg_feedback), 2),
        estimated_total_cost_cents=total_cost,
    )

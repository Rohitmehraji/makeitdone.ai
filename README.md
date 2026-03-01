# MakeItDone.ai — AI Agent Platform

Build a comprehensive AI agent platform.

MakeItDone.ai is designed as a modern AI agency platform with glassmorphism-inspired UX, domain-aware copilots, and explainable operations dashboards.

## Features
- Natural language understanding via language model API integration.
- Multi-turn memory with persisted chat sessions and message history.
- Domain customization (e.g., healthcare, finance, support, sales).
- Advanced analytics dashboard for usage, feedback, and cost tracking.
- Sentiment analysis per user and assistant message.
- Secure user management with JWT authentication.
- Role-based access control for admin-only analytics.
- Integration with external APIs (LLM + extensible REST design).
- Customizable workflows for industry-specific orchestration.
- Explainability metadata for every model response.
- Continuous learning loop from explicit user feedback.
- Robust security baseline and cloud-ready scalability patterns.

## Architecture
- **Backend (Python/FastAPI)**: modular API, authentication, chat orchestration, analytics, and persistence.
- **Frontend (React + Vite)**: chat UI, feedback workflow, analytics dashboard, secure login.
- **Data layer**: SQLAlchemy models with SQLite (easy to swap to Postgres/MySQL for production).
- **Model integration**: configurable LLM provider URL/API key/model using environment variables.

## Deployment and Scaling
- Containerize backend and frontend independently.
- Use managed Postgres + Redis for production memory/caching.
- Deploy on Kubernetes/ECS/App Runner with autoscaling.
- Add API gateway, WAF, and secret manager for enterprise security.
- Optimize costs with response caching, model tiering, async workers, and usage budgets.

## Run locally

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```



### If UI still shows old screen (no register/photos)
1. Stop old dev server processes.
2. Run frontend again and note the final port (Vite can switch from 5173 to 5174 if busy).
3. Open the exact printed URL and hard refresh (`Ctrl+F5`).
4. Confirm top banner shows `Build: ui-reg-photo-fix-2026-03-01`.

## Team images (UI branding)
- Auth flow now has dedicated **Register** and **Login** screens in the frontend.
- Add your provided photos to `frontend/public/images/` as:
  - `ai-agent.svg`
  - `ceo-rohit-mehra.svg`
- The UI will permanently load them in the hero section.

## Environment variables
- `LLM_API_KEY` (optional for real model calls; mock response used if omitted)
- `LLM_API_URL` (optional override)
- `LLM_MODEL` (optional override)

import os
from typing import List

import httpx

from app.models.models import ChatMessage

WORKFLOW_PROMPTS = {
    "default": "You are a helpful enterprise AI assistant.",
    "support": "You solve customer support issues with empathy and precision.",
    "sales": "You help with lead qualification and value-driven recommendations.",
    "healthcare": "You provide non-diagnostic operational guidance for healthcare teams.",
    "finance": "You provide compliant and conservative finance operations guidance.",
}


def classify_sentiment(text: str) -> str:
    lowered = text.lower()
    if any(x in lowered for x in ["great", "good", "love", "awesome"]):
        return "positive"
    if any(x in lowered for x in ["bad", "angry", "hate", "terrible", "frustrated"]):
        return "negative"
    return "neutral"


def estimate_cost_cents(text: str) -> int:
    return max(1, len(text) // 100)


async def call_language_model(message: str, memory: List[ChatMessage], workflow: str, domain: str) -> str:
    api_key = os.getenv("LLM_API_KEY")
    endpoint = os.getenv("LLM_API_URL", "https://api.openai.com/v1/chat/completions")
    model = os.getenv("LLM_MODEL", "gpt-4o-mini")

    system_prompt = f"{WORKFLOW_PROMPTS.get(workflow, WORKFLOW_PROMPTS['default'])} Domain: {domain}."
    context_lines = "\n".join([f"{m.role}: {m.content}" for m in memory[-8:]])

    if not api_key:
        return f"[Mocked response] Under workflow '{workflow}' for domain '{domain}', I interpreted your message as: {message}."

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Conversation context:\n{context_lines}\n\nUser: {message}"},
        ],
        "temperature": 0.2,
    }
    headers = {"Authorization": f"Bearer {api_key}"}

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(endpoint, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

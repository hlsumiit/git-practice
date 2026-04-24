import httpx
from app.config import OLLAMA_MODEL, OLLAMA_URL

async def generate_message(context: dict) -> str:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            r = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "messages": [
                        {"role": "system", "content": "You are a telco AI sales copilot. Be crisp and persuasive."},
                        {"role": "user", "content": str(context)}
                    ],
                    "stream": False
                }
            )
            r.raise_for_status()
            data = r.json()
            return data["message"]["content"]
    except Exception:
        # REST fallback (no LLM dependency)
        intent = context.get("intent", {}).get("intent_score", 0)
        device = context.get("recommendation", {}).get("device", {}).get("name", "a device")
        plan = context.get("recommendation", {}).get("plan", {}).get("name", "a plan")
        monthly = context.get("pricing", {}).get("pricing", {}).get("total_monthly", "N/A")

        if intent >= 0.7:
            return f"You're close to upgrading. Best match: {device} + {plan}. Est. monthly: ${monthly}. Want me to add protection and proceed to checkout?"
        return f"Based on your browsing, I recommend {device} with {plan}. Est. monthly: ${monthly}. Compare alternatives or check trade-in value?"
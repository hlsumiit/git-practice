from app.services.intent_service import calculate_intent

def run(session):
    score = calculate_intent(session)
    return {
        "agent": "IntentAgent",
        "intent_score": score
    }
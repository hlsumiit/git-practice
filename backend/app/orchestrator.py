from app.agents import intent_agent, recommendation_agent, pricing_agent, cross_sell_agent, checkout_agent
from app.llm.ollama_provider import generate_message

async def handle_event(session, event):

    # ---- Update session ----
    if event.event_type == "DEVICE_VIEW":
        session["devices_viewed"].append(event.payload.get("id"))

    if event.event_type == "COMPARE":
        session["compare_count"] += 1

    if event.event_type == "CHECKOUT":
        session["checkout"] = True

    logs = []

    # ---- Run Agents ----
    intent = intent_agent.run(session)
    logs.append(intent)

    reco = recommendation_agent.run(session)
    logs.append(reco)

    pricing = pricing_agent.run(reco["device"], reco["plan"])
    logs.append(pricing)

    cross = cross_sell_agent.run()
    logs.append(cross)

    checkout = checkout_agent.run(session)
    logs.append(checkout)

    # ---- SAFE MESSAGE GENERATION ----
    try:
        message = await generate_message({
            "intent": intent,
            "recommendation": reco,
            "pricing": pricing
        })
    except Exception as e:
        # Hard fallback (never break demo)
        intent_score = intent.get("intent_score", 0)
        device_name = reco["device"]["name"]
        plan_name = reco["plan"]["name"]
        monthly = pricing["pricing"]["total_monthly"]

        if intent_score >= 0.7:
            message = f"Upgrade detected. Best option: {device_name} + {plan_name}. Estimated monthly: ${monthly}. Ready to proceed?"
        else:
            message = f"Recommended: {device_name} with {plan_name}. Estimated monthly: ${monthly}. Compare more options?"

    return {
        "message": message,
        "agent_logs": logs,
        "recommendations": {
            "device": reco["device"],
            "plan": reco["plan"],
            "pricing": pricing["pricing"]
        }
    }
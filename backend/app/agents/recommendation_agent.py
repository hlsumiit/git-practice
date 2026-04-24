from app.services.catalog_service import get_catalog, get_plans

def run(session):
    catalog = get_catalog()
    plans = get_plans()

    device = catalog["devices"][0]
    plan = plans["plans"][0]

    return {
        "agent": "RecommendationAgent",
        "device": device,
        "plan": plan
    }
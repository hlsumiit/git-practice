from app.services.pricing_service import calculate_pricing

def run(device, plan):
    monthly_price = plan.get("monthly") or plan.get("price")

    pricing = calculate_pricing(
        device["price"],
        monthly_price
    )

    return {
        "pricing": pricing
    }
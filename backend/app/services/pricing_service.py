def calculate_pricing(device_price, plan_price):
    emi = round(device_price / 24)
    total = emi + plan_price + 7
    return {
        "emi": emi,
        "plan": plan_price,
        "fees": 7,
        "total_monthly": total
    }
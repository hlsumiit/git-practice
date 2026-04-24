def calculate_intent(session):
    score = 0
    if session["compare_count"] >= 2:
        score += 0.5
    if len(session["devices_viewed"]) >= 2:
        score += 0.3
    if session["checkout"]:
        score += 0.4
    return min(score, 1.0)
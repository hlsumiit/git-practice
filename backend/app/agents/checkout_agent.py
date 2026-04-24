def run(session):
    if session["checkout"]:
        return {
            "agent": "CheckoutAgent",
            "message": "Need help completing checkout?"
        }
    return {
        "agent": "CheckoutAgent",
        "message": "Browse devices to begin."
    }
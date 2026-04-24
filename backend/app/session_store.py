class SessionStore:
    def __init__(self):
        self.sessions = {}

    def get(self, session_id):
        if session_id not in self.sessions:
            self.sessions[session_id] = {
                "devices_viewed": [],
                "compare_count": 0,
                "checkout": False
            }
        return self.sessions[session_id]

store = SessionStore()
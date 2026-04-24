const API = "http://127.0.0.1:8000";

export async function sendEvent(sessionId, eventType, payload = {}) {
  const res = await fetch(`${API}/event`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      event_type: eventType,
      payload
    })
  });
  return res.json();
}

export async function health() {
  const res = await fetch(`${API}/health`);
  return res.json();
}
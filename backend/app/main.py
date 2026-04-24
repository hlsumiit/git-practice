from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import ClientEvent
from app.session_store import store
from app.orchestrator import handle_event
import time

app = FastAPI(title="B2C Agentic Sales Demo", version="1.0")

# 🔥 DEVELOPMENT MODE: Allow all local origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "http://127.0.0.1"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True, "ts": int(time.time())}

@app.post("/event")
async def event(event: ClientEvent):
    session = store.get(event.session_id)
    return await handle_event(session, event)
from pydantic import BaseModel
from typing import Dict, List, Any

class ClientEvent(BaseModel):
    session_id: str
    event_type: str
    payload: Dict[str, Any] = {}

class CopilotResponse(BaseModel):
    message: str
    agent_logs: List[Dict]
    recommendations: Dict[str, Any]
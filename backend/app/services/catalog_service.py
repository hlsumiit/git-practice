import json
from pathlib import Path

DATA_PATH = Path(__file__).resolve().parents[1] / "data"

def get_catalog():
    return json.loads((DATA_PATH / "catalog.json").read_text())

def get_plans():
    return json.loads((DATA_PATH / "plans.json").read_text())
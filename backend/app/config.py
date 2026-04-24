import os
from dotenv import load_dotenv

load_dotenv()

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")
OLLAMA_URL = os.getenv("OLLAMA_URL")

ALLOWED_ORIGINS = [os.getenv("ALLOWED_ORIGINS")]
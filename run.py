"""
DiabeteRisk AI — 1-Command Universal Full-Stack Launcher
Serves both the React Frontend UI and FastAPI Backend on http://localhost:8000
"""

import os
import sys
import webbrowser
import threading
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

# Ensure backend directory is in python path
sys.path.insert(0, BACKEND_DIR)

def open_browser():
    time.sleep(2)
    print("\n[Browser] Opening application at http://localhost:8000 ...")
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    print("=" * 65)
    print("      DiabeteRisk AI — Full-Stack Server Starting")
    print("=" * 65)
    print(f"Working directory: {BACKEND_DIR}")
    print("Serving Integrated React UI & ML API on: http://localhost:8000")
    print("Interactive Swagger API Documentation:  http://localhost:8000/docs")
    print("=" * 65)

    # Start browser opener in background thread
    threading.Thread(target=open_browser, daemon=True).start()

    # Run uvicorn
    import uvicorn
    from main import app

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")

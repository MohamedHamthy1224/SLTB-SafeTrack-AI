import os
import sys

# Ensure backend directory is in python sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, 'backend')
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app import create_app

env = os.environ.get("FLASK_ENV", "development")
app = create_app(env)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"Starting SLTB SafeTrack AI Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True, use_reloader=False)

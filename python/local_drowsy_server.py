from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route('/start-detection', methods=['POST'])
def start_detection():
    data = request.get_json()
    driver_id = data.get("driverId")
    if not driver_id:
        return jsonify({"error": "Missing driverId"}), 400

    try:
        subprocess.Popen(["python", "drowsy_detect.py", driver_id])
        return jsonify({"status": "Detection started locally"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Flask server is running at: http://localhost:5000")
    print("📡 Waiting for POST requests at /start-detection")
    app.run(host="0.0.0.0", port=5000)

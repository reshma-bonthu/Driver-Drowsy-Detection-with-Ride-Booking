from flask import Flask, request, jsonify
import subprocess

app = Flask(_name_)

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

if _name_ == '_main_':
    app.run(host="localhost", port=5000)

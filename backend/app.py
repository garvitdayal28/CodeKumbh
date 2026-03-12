from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
# Enable CORS to allow the frontend to communicate with the backend
CORS(app)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Flask backend is up and running!"
    }), 200

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

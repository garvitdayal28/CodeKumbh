from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import firebase_admin
from firebase_admin import credentials, auth, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("codekumbh-5318d-firebase-adminsdk-fbsvc-4c5adb8c4c.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

app = Flask(__name__)
# Enable CORS to allow the frontend to communicate with the backend
CORS(app)

# Firebase Web API Key (Needed for login via REST api)
# We should ideally get this from env vars, but as a fallback, we will just simulate for now or require it.
FIREBASE_WEB_API_KEY = os.environ.get('FIREBASE_WEB_API_KEY', '')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Flask backend is up and running!"
    }), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    try:
        # Create user in Firebase Auth
        user = auth.create_user(
            email=data.get('email'),
            password=data.get('password'),
            display_name=data.get('fullName'),
            phone_number=data.get('phone')
        )
        
        # Create user document in Firestore
        user_data = {
            "name": data.get('fullName'),
            "email": data.get('email'),
            "phone": data.get('phone'),
            "role": "user",
            "city": data.get('city'),
            "pincode": data.get('pincode'),
            "blood_group": data.get('bloodGroup'),
            "date_of_birth": data.get('dob'),
            "created_at": firestore.SERVER_TIMESTAMP
        }
        db.collection('users').document(user.uid).set(user_data)
        
        return jsonify({
            "status": "success", 
            "message": "User registered successfully", 
            "uid": user.uid
        }), 201
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not FIREBASE_WEB_API_KEY:
        # If no API key is provided, we can't easily verify the password via backend.
        # This is a hacky fallback for hackathon purposes if the key isn't set.
        return jsonify({"status": "error", "message": "FIREBASE_WEB_API_KEY not set. Cannot verify password on backend."}), 500

    try:
        # Call Firebase Auth REST API to verify password
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
        payload = {
            "email": email,
            "password": password,
            "returnSecureToken": True
        }
        response = requests.post(url, json=payload)
        response_data = response.json()
        
        if "error" in response_data:
            return jsonify({"status": "error", "message": response_data["error"]["message"]}), 401
            
        uid = response_data["localId"]
        
        # Fetch user role/data from Firestore
        user_doc = db.collection('users').document(uid).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}
        
        return jsonify({
            "status": "success",
            "uid": uid,
            "idToken": response_data["idToken"],
            "user": user_data
        }), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

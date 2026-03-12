from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
import firebase_admin
from firebase_admin import credentials, auth, firestore
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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
        email = data.get('email')
        password = data.get('password')
        fullName = data.get('fullName')
        phone = data.get('phone')

        # Basic server-side validation for phone
        if not phone or not phone.startswith('+91') or len(phone) != 13:
             return jsonify({"status": "error", "message": "Invalid Indian phone number format. Expected +91 followed by 10 digits."}), 400

        # Create user in Firebase Auth
        user = auth.create_user(
            email=email,
            password=password,
            display_name=fullName,
            phone_number=phone
        )
        
        # Determine role and status
        role = data.get('role', 'user')
        # Doctors are pending by default as per PRD
        status = 'pending' if role == 'doctor' else 'approved'
        
        # Create user document in Firestore
        user_data = {
            "name": fullName,
            "email": email,
            "phone": phone,
            "role": role,
            "status": status,
            "city": data.get('city'),
            "pincode": data.get('pincode'),
            "blood_group": data.get('bloodGroup'),
            "date_of_birth": data.get('dob'),
            "created_at": firestore.SERVER_TIMESTAMP
        }
        
        # Add doctor specific fields if role is doctor
        if role == 'doctor':
            user_data.update({
                "specialization": data.get('specialization'),
                "registration_number": data.get('medicalRegNumber'),
                "hospital_name": data.get('hospitalName'),
                "hospital_id": data.get('hospitalId'),
                "department": data.get('department')
            })
            
        db.collection('users').document(user.uid).set(user_data)
        
        return jsonify({
            "status": "success", 
            "message": f"{role.capitalize()} registered successfully", 
            "uid": user.uid,
            "role": role,
            "account_status": status
        }), 201
    except Exception as e:
        error_msg = str(e)
        if "CONFIGURATION_NOT_FOUND" in error_msg:
            error_msg = "Auth provider not enabled. Please enable 'Email/Password' in your Firebase Console -> Authentication -> Sign-in method."
        return jsonify({"status": "error", "message": error_msg}), 400

@app.route('/api/auth/doctor-register', methods=['POST'])
def doctor_register():
    # Reuse the same logic but explicitly set role to doctor
    data = request.json
    data['role'] = 'doctor'
    return register()

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not FIREBASE_WEB_API_KEY:
        return jsonify({
            "status": "error", 
            "message": "Missing FIREBASE_WEB_API_KEY. To fix: Go to Firebase Console -> Project Settings -> General -> Web API Key, then set it as an environment variable or in app.py."
        }), 500

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

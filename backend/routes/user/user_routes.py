"""
User Routes Blueprint
Handles user/patient-specific operations (to be implemented)
"""
from flask import Blueprint

from utils.responses import success_response, error_response

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get user dashboard data"""
    # TODO: Implement user dashboard
    return success_response("User dashboard endpoint - Coming soon")

@user_bp.route('/appointments', methods=['GET'])
def get_appointments():
    """Get user's appointments"""
    # TODO: Implement appointments retrieval
    return success_response("User appointments endpoint - Coming soon")

@user_bp.route('/hospitals', methods=['GET'])
def get_hospitals():
    """Get all hospitals for appointment booking"""
    try:
        from config.firebase import db
        hospitals_ref = db.collection('hospitals')
        hospitals = []
        
        for doc in hospitals_ref.stream():
            hospital = doc.to_dict()
            hospital['id'] = doc.id
            hospitals.append(hospital)
        
        return success_response(
            "Hospitals retrieved successfully",
            {"hospitals": hospitals}
        )
    except Exception as e:
        return error_response(str(e))

@user_bp.route('/doctors', methods=['GET'])
def get_doctors():
    """Get doctors filtered by hospital and department"""
    try:
        from flask import request
        from config.firebase import db
        
        hospital_name = request.args.get('hospitalName')
        department = request.args.get('department')
        
        users_ref = db.collection('users').where('role', '==', 'doctor').where('status', '==', 'approved')
        doctors = []
        
        for doc in users_ref.stream():
            doctor = doc.to_dict()
            doctor['uid'] = doc.id
            
            # Filter by hospital and department if provided
            if hospital_name and doctor.get('hospitalName') != hospital_name:
                continue
            if department and doctor.get('department') != department:
                continue
                
            doctors.append(doctor)
        
        return success_response(
            "Doctors retrieved successfully",
            {"doctors": doctors}
        )
    except Exception as e:
        return error_response(str(e))

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    """Get user profile"""
    # TODO: Implement profile retrieval
    return success_response("User profile endpoint - Coming soon")

@user_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    # TODO: Implement profile update
    return success_response("User profile update endpoint - Coming soon")

@user_bp.route('/blood-requests', methods=['GET'])
def get_blood_requests():
    """Get all blood requests"""
    try:
        from config.firebase import db
        requests_ref = db.collection('bloodRequests').order_by('createdAt', direction='DESCENDING')
        requests = []
        
        for doc in requests_ref.stream():
            request = doc.to_dict()
            request['id'] = doc.id
            requests.append(request)
        
        return success_response(
            "Blood requests retrieved successfully",
            {"requests": requests}
        )
    except Exception as e:
        return error_response(str(e))

@user_bp.route('/blood-requests', methods=['POST'])
def create_blood_request():
    """Create a new blood request"""
    try:
        from flask import request
        from config.firebase import db, auth
        from datetime import datetime
        
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        user_doc = db.collection('users').document(uid).get()
        if not user_doc.exists:
            return error_response("User not found", 404)
        
        user_data = user_doc.to_dict()
        data = request.get_json()
        
        blood_request = {
            'requesterId': uid,
            'requesterName': user_data.get('name') or user_data.get('fullName'),
            'phone': user_data.get('phone'),
            'email': user_data.get('email'),
            'bloodGroup': data.get('bloodGroup'),
            'units': data.get('units', 1),
            'urgency': data.get('urgency', 'Normal'),
            'hospitalName': data.get('hospitalName'),
            'reason': data.get('reason', ''),
            'createdAt': datetime.utcnow().isoformat(),
            'status': 'active'
        }
        
        db.collection('bloodRequests').add(blood_request)
        
        return success_response(
            "Blood request created successfully",
            {"request": blood_request}
        )
    except Exception as e:
        return error_response(str(e))

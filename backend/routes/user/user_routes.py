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
            
            # Add fullName if not present (use name field)
            if 'fullName' not in doctor and 'name' in doctor:
                doctor['fullName'] = doctor['name']
            
            # Filter by hospital and department if provided
            if hospital_name and doctor.get('hospital_name') != hospital_name:
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

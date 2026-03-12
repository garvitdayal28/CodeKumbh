"""
User Routes Blueprint
Handles user/patient-specific operations (to be implemented)
"""
from flask import Blueprint
from google.cloud import firestore

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
    try:
        from flask import request
        from config.firebase import db
        
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return error_response("User ID is required", 400)
        
        # Get user document
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return error_response("User not found", 404)
        
        # Prepare update data
        update_data = {}
        
        # Update chronic diseases if provided
        if 'chronicDiseases' in data:
            update_data['chronicDiseases'] = data.get('chronicDiseases')
        
        # Update other fields if provided
        if 'name' in data:
            update_data['name'] = data.get('name')
        if 'phone' in data:
            update_data['phone'] = data.get('phone')
        if 'city' in data:
            update_data['city'] = data.get('city')
        if 'bloodGroup' in data:
            update_data['blood_group'] = data.get('bloodGroup')

        # Update donor profile fields if provided
        if 'isBloodDonor' in data:
            update_data['isBloodDonor'] = bool(data.get('isBloodDonor'))
        if 'lastDonationDate' in data:
            update_data['lastDonationDate'] = data.get('lastDonationDate')
        if 'donationHistory' in data:
            update_data['donationHistory'] = data.get('donationHistory')

        if not update_data:
            return error_response("No valid fields provided for update", 400)
        
        # Update user document
        user_ref.update(update_data)

        # Return updated user snapshot for frontend sync
        updated_user = user_ref.get().to_dict()
        updated_user['uid'] = user_id

        # Keep camelCase blood group in API responses for frontend compatibility
        if 'blood_group' in updated_user and 'bloodGroup' not in updated_user:
            updated_user['bloodGroup'] = updated_user.get('blood_group')
        
        return success_response(
            "Profile updated successfully",
            {
                'updatedFields': list(update_data.keys()),
                'user': updated_user
            }
        )
    except Exception as e:
        return error_response(f"Error updating profile: {str(e)}", 500)

@user_bp.route('/appointments', methods=['POST'])
def create_appointment():
    """Create a new appointment for user"""
    try:
        from flask import request
        from config.firebase import db
        
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return error_response("User ID is required", 400)
        
        # Get user document
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return error_response("User not found", 404)
        
        user_data = user_doc.to_dict()
        
        # Create appointment object
        appointment = {
            'id': data.get('id'),
            'hospitalName': data.get('hospitalName'),
            'ward': data.get('ward'),
            'doctorName': data.get('doctorName', 'Not Specified'),
            'doctorId': data.get('doctorId'),
            'date': data.get('date'),
            'time': data.get('time'),
            'reason': data.get('reason'),
            'priority': data.get('priority', 'Normal'),
            'status': 'Upcoming',
            'createdAt': data.get('createdAt')
        }
        
        # Get existing appointments
        appointments = user_data.get('appointments', [])
        appointments.append(appointment)
        
        # Update chronic diseases if provided
        update_data = {'appointments': appointments}
        if 'chronicDiseases' in data:
            update_data['chronicDiseases'] = data.get('chronicDiseases')
        
        # Update user document
        user_ref.update(update_data)
        
        return success_response(
            "Appointment created successfully",
            {'appointment': appointment}
        )
    except Exception as e:
        return error_response(f"Error creating appointment: {str(e)}", 500)

@user_bp.route('/appointments/<appointment_id>', methods=['DELETE'])
def cancel_appointment(appointment_id):
    """Cancel an appointment"""
    try:
        from flask import request
        from config.firebase import db
        
        data = request.json
        user_id = data.get('userId')
        
        if not user_id:
            return error_response("User ID is required", 400)
        
        # Get user document
        user_ref = db.collection('users').document(user_id)
        user_doc = user_ref.get()
        
        if not user_doc.exists:
            return error_response("User not found", 404)
        
        user_data = user_doc.to_dict()
        appointments = user_data.get('appointments', [])
        
        # Find and update the appointment status
        appointment_found = False
        for apt in appointments:
            if apt.get('id') == appointment_id:
                apt['status'] = 'Cancelled'
                appointment_found = True
                break
        
        if not appointment_found:
            return error_response("Appointment not found", 404)
        
        # Update user document
        user_ref.update({'appointments': appointments})
        
        return success_response(
            "Appointment cancelled successfully",
            {'appointmentId': appointment_id}
        )
    except Exception as e:
        return error_response(f"Error cancelling appointment: {str(e)}", 500)

@user_bp.route('/blood-requests', methods=['GET'])
def get_blood_requests():
    """Get all blood requests"""
    try:
        from config.firebase import db
        requests_ref = db.collection('bloodRequests').order_by('createdAt', direction=firestore.Query.DESCENDING)
        requests = []
        
        for doc in requests_ref.stream():
            request_data = doc.to_dict()
            request_data['id'] = doc.id
            requests.append(request_data)
        
        return success_response(
            "Blood requests retrieved successfully",
            {"requests": requests}
        )
    except Exception as e:
        print(f"Error fetching blood requests: {str(e)}")
        return success_response(
            "Blood requests retrieved successfully",
            {"requests": []}
        )

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

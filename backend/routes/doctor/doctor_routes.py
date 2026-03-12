"""
Doctor Routes Blueprint
Handles doctor-specific operations including queue management
"""
from flask import Blueprint, request
from datetime import datetime
from config.firebase import db
from utils.responses import success_response, error_response
from config.socketio import socketio
from flask_socketio import emit

doctor_bp = Blueprint('doctor', __name__, url_prefix='/api/doctor')

@doctor_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """Get doctor dashboard data"""
    return success_response("Doctor dashboard endpoint - Coming soon")

@doctor_bp.route('/appointments/today', methods=['GET'])
def get_today_appointments():
    """Get today's appointments for doctor"""
    try:
        doctor_id = request.args.get('doctorId')
        if not doctor_id:
            return error_response("Doctor ID required", 400)
        
        # Get doctor info to find their name
        doctor_doc = db.collection('users').document(doctor_id).get()
        if not doctor_doc.exists:
            return error_response("Doctor not found", 404)
        
        doctor_data = doctor_doc.to_dict()
        doctor_name = doctor_data.get('name') or doctor_data.get('fullName')
        
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Get all users and filter appointments
        users_ref = db.collection('users').where('role', '==', 'user')
        today_appointments = []
        
        for user_doc in users_ref.stream():
            user_data = user_doc.to_dict()
            user_appointments = user_data.get('appointments', [])
            
            for apt in user_appointments:
                if apt.get('doctorName') == doctor_name and apt.get('date') == today:
                    apt['patientName'] = user_data.get('name') or user_data.get('fullName')
                    apt['patientPhone'] = user_data.get('phone')
                    apt['patientId'] = user_doc.id
                    today_appointments.append(apt)
        
        # Sort by time
        today_appointments.sort(key=lambda x: x.get('time', ''))
        
        return success_response("Today's appointments retrieved", {'appointments': today_appointments})
    except Exception as e:
        return error_response(f"Error fetching today's appointments: {str(e)}", 500)

@doctor_bp.route('/queue/update', methods=['POST'])
def update_queue_status():
    """Update appointment status and notify users"""
    try:
        data = request.json
        appointment_id = data.get('appointmentId')
        status = data.get('status')  # 'completed', 'in-progress', 'waiting'
        
        if not appointment_id or not status:
            return error_response("Appointment ID and status required", 400)
        
        # Update appointment status
        appointment_ref = db.collection('appointments').document(appointment_id)
        appointment_ref.update({
            'status': status,
            'updatedAt': datetime.now()
        })
        
        # Get updated appointment data
        appointment = appointment_ref.get().to_dict()
        doctor_id = appointment.get('doctorId')
        
        # Emit real-time update to specific doctor's queue room
        socketio.emit('queue_updated', {
            'appointmentId': appointment_id,
            'status': status,
            'userId': appointment.get('userId'),
            'doctorId': doctor_id,
            'appointment': appointment
        }, room=f'queue_{doctor_id}')
        
        return success_response("Queue updated successfully", {'appointment': appointment})
    except Exception as e:
        return error_response(str(e), 500)

@doctor_bp.route('/patients', methods=['GET'])
def get_patients():
    """Get doctor's patients"""
    return success_response("Doctor patients endpoint - Coming soon")

@doctor_bp.route('/appointments', methods=['GET'])
def get_appointments():
    """Get all appointments for a doctor"""
    try:
        doctor_id = request.args.get('doctorId')
        doctor_name = request.args.get('doctorName')
        
        if not doctor_id and not doctor_name:
            return error_response("Doctor ID or name required", 400)
        
        # Get all users and filter appointments
        users_ref = db.collection('users').where('role', '==', 'user')
        all_appointments = []
        
        for user_doc in users_ref.stream():
            user_data = user_doc.to_dict()
            user_appointments = user_data.get('appointments', [])
            
            for apt in user_appointments:
                # Filter by doctor name
                if doctor_name and apt.get('doctorName') == doctor_name:
                    apt['patientName'] = user_data.get('name') or user_data.get('fullName')
                    apt['patientPhone'] = user_data.get('phone')
                    apt['patientId'] = user_doc.id
                    all_appointments.append(apt)
        
        # Sort by date and time
        all_appointments.sort(key=lambda x: (x.get('date', ''), x.get('time', '')), reverse=True)
        
        return success_response(
            "Appointments retrieved successfully",
            {"appointments": all_appointments, "total": len(all_appointments)}
        )
    except Exception as e:
        return error_response(f"Error fetching appointments: {str(e)}", 500)

@doctor_bp.route('/profile', methods=['PUT'])
def update_profile():
    """Update doctor profile"""
    try:
        data = request.json
        doctor_id = data.get('uid') or data.get('doctorId')
        
        if not doctor_id:
            return error_response("Doctor ID (uid) is required", 400)
        
        # Prepare update data
        update_data = {}
        
        if data.get('fullName'):
            update_data['name'] = data.get('fullName')
            update_data['fullName'] = data.get('fullName')
        if data.get('email'):
            update_data['email'] = data.get('email')
        if data.get('phone'):
            update_data['phone'] = data.get('phone')
        if data.get('specialization'):
            update_data['specialization'] = data.get('specialization')
        if data.get('medicalRegNumber'):
            update_data['registration_number'] = data.get('medicalRegNumber')
        if data.get('hospitalName'):
            update_data['hospital_name'] = data.get('hospitalName')
        if data.get('hospitalId'):
            update_data['hospital_id'] = data.get('hospitalId')
        if data.get('department'):
            update_data['department'] = data.get('department')
        if data.get('aadhaarNumber'):
            update_data['aadhaarNumber'] = data.get('aadhaarNumber')
        
        if not update_data:
            return error_response("No data to update", 400)
        
        # Update in Firestore
        db.collection('users').document(doctor_id).update(update_data)
        
        return success_response("Profile updated successfully", {"user": update_data})
    except Exception as e:
        return error_response(f"Error updating profile: {str(e)}", 500)

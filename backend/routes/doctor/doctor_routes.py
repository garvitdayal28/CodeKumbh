"""
Doctor Routes Blueprint
Handles doctor-specific operations including queue management
"""
from flask import Blueprint, request
from datetime import datetime
from config.firebase import db
from utils.responses import success_response, error_response
from app import socketio

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
        
        today = datetime.now().strftime('%Y-%m-%d')
        appointments_ref = db.collection('appointments')
        query = appointments_ref.where('doctorId', '==', doctor_id).where('date', '==', today).order_by('appointmentTime')
        appointments = [{'id': doc.id, **doc.to_dict()} for doc in query.stream()]
        
        return success_response("Today's appointments retrieved", {'appointments': appointments})
    except Exception as e:
        return error_response(str(e), 500)

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
        
        # Emit real-time update to all connected clients
        socketio.emit('queue_updated', {
            'appointmentId': appointment_id,
            'status': status,
            'userId': appointment.get('userId'),
            'doctorId': appointment.get('doctorId')
        })
        
        return success_response("Queue updated successfully", {'appointment': appointment})
    except Exception as e:
        return error_response(str(e), 500)

@doctor_bp.route('/patients', methods=['GET'])
def get_patients():
    """Get doctor's patients"""
    return success_response("Doctor patients endpoint - Coming soon")

"""
SocketIO instance
Separate module to avoid circular imports
"""
from flask_socketio import SocketIO

socketio = SocketIO(cors_allowed_origins="*")

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.29.7:5000';

export const useQueueSocket = (doctorId, onQueueUpdate) => {
  const socketRef = useRef(null);
  const callbackRef = useRef(onQueueUpdate);

  useEffect(() => {
    callbackRef.current = onQueueUpdate;
  }, [onQueueUpdate]);

  useEffect(() => {
    if (!doctorId) return;

    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to queue socket');
      socketRef.current.emit('join_queue', { doctorId });
    });

    socketRef.current.on('queue_updated', (data) => {
      console.log('Queue updated:', data);
      if (callbackRef.current) {
        callbackRef.current(data);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_queue', { doctorId });
        socketRef.current.disconnect();
      }
    };
  }, [doctorId]);

  return socketRef.current;
};

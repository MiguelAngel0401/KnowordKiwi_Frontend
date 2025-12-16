'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { isSocketConnected, getSocket } from '@/utils/socketUtils';

interface SocketStatusProps {
  showConnectionStatus?: boolean;
}

const SocketStatus: React.FC<SocketStatusProps> = ({ showConnectionStatus = true }) => {
  const { isAuthenticated } = useAuthStore();
  const [socketStatus, setSocketStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setSocketStatus('disconnected');
      setSocketId(null);
      return;
    }

    // Subscribe to socket changes
    const unsubscribe = useAuthStore.subscribe((state) => {
      const socket = state.socket;
      if (socket) {
        setSocketStatus(socket.connected ? 'connected' : 'connecting');
        setSocketId(socket.id || null);

        // Listen for connection events
        socket.on('connect', () => {
          setSocketStatus('connected');
          setSocketId(socket.id);
        });
        
        socket.on('disconnect', () => {
          setSocketStatus('disconnected');
        });
        
        socket.on('connect_error', () => {
          setSocketStatus('error');
        });
      } else {
        setSocketStatus('disconnected');
        setSocketId(null);
      }
    });

    // Set initial status
    const initialSocket = getSocket();
    if (initialSocket) {
      setSocketStatus(initialSocket.connected ? 'connected' : 'connecting');
      setSocketId(initialSocket.id || null);
    } else if (isAuthenticated) {
      setSocketStatus('connecting');
    }

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated]);

  if (!showConnectionStatus) {
    return null;
  }

  const statusColors = {
    connected: 'bg-green-500',
    connecting: 'bg-yellow-500',
    disconnected: 'bg-red-500',
    error: 'bg-red-700',
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-3 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${statusColors[socketStatus]}`}></div>
        <span className="text-sm font-medium">
          Socket: {socketStatus} {socketId && `(${socketId.substring(0, 5)}...)`}
        </span>
      </div>
    </div>
  );
};

export default SocketStatus;
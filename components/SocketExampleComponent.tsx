// Example of how to use the socket in a component
'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getSocket } from '@/utils/socketUtils';

const SocketExampleComponent = () => {
  const { isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<string[]>([]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socket = getSocket();
    
    if (socket) {
      // Listen for custom events from the server
      socket.on('notification', (data) => {
        setMessages(prev => [...prev, `Notification: ${JSON.stringify(data)}`]);
      });

      socket.on('message', (data) => {
        setMessages(prev => [...prev, `Message: ${JSON.stringify(data)}`]);
      });

      // Cleanup listeners on unmount
      return () => {
        socket.off('notification');
        socket.off('message');
      };
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <div>Please log in to see socket events</div>;
  }

  return (
    <div className="p-4">
      <h2>Socket Events</h2>
      <div className="mt-4 max-h-60 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 my-1 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocketExampleComponent;
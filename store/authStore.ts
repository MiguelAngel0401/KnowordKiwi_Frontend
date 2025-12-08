import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { io, Socket } from "socket.io-client";

type AuthState = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  clearAuth: () => void;
  socket: Socket | null;
  connectSocket: () => void;
  disconnectSocket: () => void;
  updateSocketToken: () => void;
};

// Function to get access token from cookies
const getAccessToken = (): string | null => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access-token' && value) {
        return decodeURIComponent(value);
      }
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        isAuthenticated: false,
        socket: null,
        setIsAuthenticated: (isAuthenticated) => {
          const currentState = get();
          
          // If authentication status changes from false to true, connect socket
          if (!currentState.isAuthenticated && isAuthenticated) {
            set({ isAuthenticated });
            // Connect the socket after setting the authentication state
            setTimeout(() => get().connectSocket(), 0);
          } else if (currentState.isAuthenticated && !isAuthenticated) {
            // If authentication status changes from true to false, disconnect socket
            currentState.disconnectSocket();
            set({ isAuthenticated });
          } else {
            set({ isAuthenticated });
          }
        },
        clearAuth: () => {
          const currentState = get();
          currentState.disconnectSocket();
          set({ isAuthenticated: false });
        },
        connectSocket: () => {
          const token = getAccessToken();
          if (!token) {
            console.warn("No access token found for socket connection");
            return;
          }

          // If there's already a socket connection, disconnect it first
          if (get().socket) {
            get().socket!.disconnect();
          }

          // Create new socket connection with the token in the headers
          const newSocket: Socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", {
            auth: {
              token: `Bearer ${token}`,
            },
            transports: ['websocket'],
            withCredentials: true,
          });

          // Add event listeners
          newSocket.on('connect', () => {
            console.log('Connected to WebSocket server with ID:', newSocket.id);
          });

          newSocket.on('disconnect', (reason) => {
            console.log('Disconnected from WebSocket server:', reason);
          });

          newSocket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error);
          });

          set({ socket: newSocket });
        },
        disconnectSocket: () => {
          const socket = get().socket;
          if (socket) {
            socket.disconnect();
            set({ socket: null });
          }
        },
        updateSocketToken: () => {
          const currentSocket = get().socket;
          if (currentSocket) {
            // Disconnect the current socket
            currentSocket.disconnect();

            // Connect a new socket with the updated token
            get().connectSocket();
          }
        },
      }),
      {
        name: "auth-storage", // nombre de la clave en sessionStorage
        storage: createJSONStorage(() => sessionStorage), // especifica sessionStorage
      },
    ),
  ),
);
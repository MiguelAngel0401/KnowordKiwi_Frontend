import { useAuthStore } from '@/store/authStore';

/**
 * Utility function to get the socket instance
 * @returns Socket instance or null if not connected
 */
export const getSocket = () => {
  return useAuthStore.getState().socket;
};

/**
 * Utility function to check if socket is connected
 * @returns boolean indicating if socket is connected
 */
export const isSocketConnected = () => {
  const socket = useAuthStore.getState().socket;
  return socket !== null && socket.connected;
};

/**
 * Connect socket - this is handled automatically when authentication status changes
 * but can be called manually if needed
 */
export const connectSocket = () => {
  useAuthStore.getState().connectSocket();
};

/**
 * Disconnect socket - this is handled automatically during logout
 * but can be called manually if needed
 */
export const disconnectSocket = () => {
  useAuthStore.getState().disconnectSocket();
};

/**
 * Update socket token - useful when the access token is refreshed
 */
export const updateSocketToken = () => {
  useAuthStore.getState().updateSocketToken();
};
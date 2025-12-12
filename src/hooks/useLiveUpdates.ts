import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import liveUpdateService from '../services/liveUpdateService';

/**
 * Custom hook to automatically connect to live update service
 * when user is authenticated and disconnect when logged out
 */
export const useLiveUpdates = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('sevadaan_token');
      if (token) {
        // Connect to live update service
        liveUpdateService.connect(token);

        // Join NGO room if user is NGO admin/manager
        if (user.role === 'ngo_admin' || user.role === 'ngo_manager') {
          if (user.ngoId) {
            liveUpdateService.joinNGORoom(user.ngoId);
          }
        }
      }
    } else {
      // Disconnect when not authenticated
      liveUpdateService.disconnect();
    }

    return () => {
      // Cleanup on unmount
      if (user?.ngoId && (user.role === 'ngo_admin' || user.role === 'ngo_manager')) {
        liveUpdateService.leaveNGORoom(user.ngoId);
      }
    };
  }, [isAuthenticated, user]);

  return {
    connectionStatus: liveUpdateService.getConnectionStatus(),
    requestDataRefresh: liveUpdateService.requestDataRefresh.bind(liveUpdateService),
  };
};

export default useLiveUpdates;

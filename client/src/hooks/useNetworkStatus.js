import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // navigator.connection is the entry point for the Network Information API
    const connection = navigator.connection;

    if (!connection) {
      // If the API is not supported, we assume a good connection.
      console.warn('Network Information API not supported.');
      return;
    }

    const updateConnectionStatus = () => {
      // effectiveType gives an estimate of the connection quality.
      // 'slow-2g' and '2g' are considered slow.
      const slow = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
      setIsSlowConnection(slow);
    };

    updateConnectionStatus(); // Check on initial load

    // Listen for any changes in the user's network connection
    connection.addEventListener('change', updateConnectionStatus);

    // Cleanup the event listener when the component unmounts
    return () => {
      connection.removeEventListener('change', updateConnectionStatus);
    };
  }, []);

  return { isSlowConnection };
};
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (e.g., by checking for a valid token)
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, user is authenticated
      setAuthenticated(true);
    } else {
      // Token doesn't exist, user is not authenticated
      setAuthenticated(false);
    }
  }, []);

  return { authenticated, setAuthenticated };
};

export default useAuth;

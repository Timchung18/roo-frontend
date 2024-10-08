// useUser.js
import { useState, useEffect } from 'react';

function useUser(userType) {
  // Initialize the user state with the value from localStorage, if it exists
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(userType);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync the user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(userType, JSON.stringify(user));
    } else {
      localStorage.removeItem(userType);
    }
  }, [user]);

  return [user, setUser];
}

export default useUser;

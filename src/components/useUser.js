// useUser.js
import { useState, useEffect } from 'react';

function useUser() {
  // Initialize the user state with the value from localStorage, if it exists
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync the user state to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return [user, setUser];
}

export default useUser;

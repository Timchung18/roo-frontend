// src/Users.js

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) console.error('Error fetching users:', error);
    else setUsers(users);
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;

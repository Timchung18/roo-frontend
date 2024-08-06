// src/components/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {supabase} from '../supabaseClient';

const Login = ({setUser}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);
      if (error) {
        setError(error.message);
        console.log(error.message);
        
      } else {
        if (data.length === 1) {
            console.log(data[0].first_name, data[0].last_name);
            setUser(data[0]);
            navigate(`/home/${data[0].user_id}`);
        } else {
            setError("No account with this email was found");
            console.log("No account with this email was found");
        }
      }
    } catch (error){
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;

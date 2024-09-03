import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useUser } from '../UserContext';

const RestaurantLogin = ({ setRestaurantUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

//   const handleSubmit1 = async (event) => {
//     event.preventDefault();
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) {
//         setError(error.message);
//         console.log(error.message);
//       } else {
//         setRestaurantUser(data.user);
//         navigate(`/restaurant-home/${data.user.id}`);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.');
//       console.log(error.message);
//     }
//   };

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
            setRestaurantUser(data[0]);
            
            navigate(`/restaurant/${data[0].user_id}`);
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
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-6">Restaurant Owner Login</h2>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label class="block text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div class="mb-6">
            <label class="block text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {error && <p class="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>

    
  );
};

export default RestaurantLogin;

// <div>
//       <h2>Restaurant Owner Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label>Password:</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         {error && <p>{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>

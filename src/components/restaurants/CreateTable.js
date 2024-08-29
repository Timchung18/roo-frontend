import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const CreateTable = ({user}) => {
  const [minSeats, setMinSeats] = useState('');
  const [maxSeats, setMaxSeats] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const restaurantId = 1; // Replace with dynamic restaurant ID if needed

      const { data, error } = await supabase
        .from('tables')
        .insert([
          {
            restaurant_id: restaurantId,
            min_number_of_seats: minSeats,
            max_number_of_seats: maxSeats,
            table_number: tableNumber,
          },
        ]);

      if (error) throw error;

      // Redirect to the restaurant home page after successful creation
      navigate(`/restaurant/${user.user_id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
  <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Create New Table</h1>
    <form onSubmit={handleSubmit}>
      <div class="mb-4">
        <label class="block text-gray-700">Table Number:</label>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700">Min Seats:</label>
        <input
          type="number"
          value={minSeats}
          onChange={(e) => setMinSeats(e.target.value)}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700">Max Seats:</label>
        <input
          type="number"
          value={maxSeats}
          onChange={(e) => setMaxSeats(e.target.value)}
          required
          class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
      >
        Create Table
      </button>
    </form>
    {error && <p class="text-red-500 mt-4">Error: {error}</p>}
  </div>
</div>

  );
};

export default CreateTable;

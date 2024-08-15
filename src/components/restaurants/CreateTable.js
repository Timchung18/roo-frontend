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
    <div>
      <h1>Create New Table</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Table Number:</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Min Seats:</label>
          <input
            type="number"
            value={minSeats}
            onChange={(e) => setMinSeats(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Max Seats:</label>
          <input
            type="number"
            value={maxSeats}
            onChange={(e) => setMaxSeats(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Table</button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default CreateTable;

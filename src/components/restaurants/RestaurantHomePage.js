import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const RestaurantHomePage = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurant information and tables
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restaurantId = 1; // Replace with dynamic ID if needed

        // Fetch restaurant information
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('restaurant_id', restaurantId)
          .single();

        if (restaurantError) throw restaurantError;

        setRestaurant(restaurantData);

        // Fetch tables associated with the restaurant
        const { data: tablesData, error: tablesError } = await supabase
          .from('tables')
          .select('*')
          .eq('restaurant_id', restaurantId);

        if (tablesError) throw tablesError;

        setTables(tablesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  if (loading) return <p>Loading restaurant data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Description:</strong> {restaurant.description}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <p><strong>Price per Seat:</strong> ${restaurant.price_per_seat}</p>
      <p><strong>Rating:</strong> {restaurant.rating}</p>
      <p><strong>Hours:</strong> {restaurant.hour_open} - {restaurant.hour_closed}</p>

      <h2>Tables</h2>
      {tables.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Table Number</th>
              <th>Min Seats</th>
              <th>Max Seats</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.table_id}>
                <td>{table.table_number}</td>
                <td>{table.min_number_of_seats}</td>
                <td>{table.max_number_of_seats}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No tables available.</p>
      )}
    </div>
  );
};

export default RestaurantHomePage;

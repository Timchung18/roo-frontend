import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

const CreateEvent = ({user}) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDate: '',
    eventDescription: '',
    restaurantId: ''
  });
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*');

      if (error) {
        console.error('Error fetching restaurants:', error);
      } else {
        setRestaurants(data);
      }
    };

    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // check if there is a table available at the restaurant
    const { data: tableQueryRes, error: tableQueryErr } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', eventData.restaurantId)
      .lte('min_number_of_seats', eventData.numberOfSeats)
      .gte('max_number_of_seats', eventData.numberOfSeats)
      .order('max_number_of_seats', { ascending: true });
    if (tableQueryErr) {
      console.error('Error fetching restaurants:', tableQueryErr);
    } else {
      console.log('API fetch successful');
    }
    if (tableQueryRes) {
      // console.log(tableQueryRes[0]);
      

    } else {
      console.log("no tables available");
    }

    // add the event to the events table
    const eventObject = {
        host_user_id: user.user_id,
        event_date: eventData.eventDate,
        event_time: eventData.eventTime,
        description: eventData.eventDescription,
        number_of_seats_taken: 1,
        number_of_seats_requested: eventData.numberOfSeats,
        table_id: tableQueryRes.table_id,
    }
    console.log(eventObject);
    const { data: insertEventData, error: insertEventError } = await supabase
      .from('events')
      .insert([{
        host_user_id: user.user_id,
        event_date: eventData.eventDate,
        event_time: eventData.eventTime,
        description: eventData.eventDescription,
        number_of_seats_taken: 1,
        number_of_seats_requested: eventData.numberOfSeats,
        table_id: tableQueryRes[0].table_id,
      }])
      .select();

    if (insertEventError) {
      console.error('Error creating event:', insertEventError);
    } else {
      console.log(insertEventData[0].link);
      const baseUrl = "http://localhost:3000/join/";
      const uniqueUrl = `${baseUrl}${insertEventData[0].link}`;
      
      navigate(`/home/${user.user_id}`);
    }
  };
  
  // Generate half-hour time slots
  const generateTimeSlots = () => {
    const times = [];
    for (let i = 0; i < 24; i++) {
      const hour = i % 12 === 0 ? 12 : i % 12;
      const suffix = i < 12 ? 'AM' : 'PM';
      times.push(`${hour}:00 ${suffix}`, `${hour}:30 ${suffix}`);
    }
    return times;
  };


  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Create a New Event</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        
        <TextField
          label="Event Date"
          name="eventDate"
          type="date"
          value={eventData.eventDate}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <TextField
          label="Event Time"
          name="eventTime"
          select
          value={eventData.eventTime}
          onChange={handleChange}
          required
          sx={{ width: 150 }} // Adjust the width as needed
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 200, // Adjust the max height as needed
                },
              },
            },
          }}
        >
          {generateTimeSlots().map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
          
        </TextField>

        <TextField
          label="Number of Seats"
          name="numberOfSeats"
          type="number"
          value={eventData.numberOfSeats}
          onChange={handleChange}
          InputProps={{ inputProps: { min: 1 } }}
          required
        />

        <TextField
          label="Select Restaurant"
          name="restaurantId"
          value={eventData.restaurantId}
          onChange={handleChange}
          select
          required
        >
          {restaurants.map((restaurant) => (
            <MenuItem key={restaurant.restaurant_id} value={restaurant.restaurant_id}>
              {restaurant.name} - {restaurant.address}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Event Description"
          name="eventDescription"
          value={eventData.eventDescription}
          onChange={handleChange}
          multiline
          rows={4}
          required
        />
        <Button variant="contained" color="primary" type="submit">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;

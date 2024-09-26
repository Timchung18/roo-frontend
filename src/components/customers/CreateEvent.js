import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Typography } from '@mui/material';
import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { DateTime } from 'luxon';

const CreateEvent = ({user}) => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDate: '',
    eventDescription: '',
    restaurantId: ''
  });
  const [restaurants, setRestaurants] = useState([]);
  const [tableError, setTableError] = useState('');

  const timezone = "America/Los_Angeles";

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
    console.log("restID", eventData.restaurantId);
    const { data: tableQueryRes, error: tableQueryErr } = await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', eventData.restaurantId)
      .lte('min_number_of_seats', eventData.numberOfSeats)
      .gte('max_number_of_seats', eventData.numberOfSeats)
      .order('max_number_of_seats', { ascending: true });
    if (tableQueryErr) {
      console.error('Error fetching restaurants:', tableQueryErr);
      return;
    } else {
      console.log('API fetch successful');
    }
    if (tableQueryRes[0]) {
      console.log(tableQueryRes);
      // add the event to the events table
      // const eventObject = {
      //   host_user_id: user.user_id,
      //   event_date: eventData.eventDate,
      //   event_time: eventData.eventTime,
      //   description: eventData.eventDescription,
      //   number_of_seats_taken: 1,
      //   number_of_seats_requested: eventData.numberOfSeats,
      //   table_id: tableQueryRes[0].table_id,
      // }
      
      const timestamp = convertToTimestampWithTimezone(eventData.eventDate, eventData.eventTime, timezone);
      console.log(timestamp);
      // console.log(eventObject);
      console.log(tableQueryRes[0].restaurant_id);
      const fundingPerPerson = (tableQueryRes[0].min_fund / eventData.numberOfSeats).toFixed(2);
      const { data: insertEventData, error: insertEventError } = await supabase
        .from('events')
        .insert([{
          host_user_id: user.user_id,
          event_date: eventData.eventDate,
          event_time: eventData.eventTime,
          description: eventData.eventDescription,
          number_of_seats_taken: 0,
          number_of_seats_requested: eventData.numberOfSeats,
          table_id: tableQueryRes[0].table_id,
          event_date_time: timestamp,
          restaurant_id: tableQueryRes[0].restaurant_id,
          funding_per_person: fundingPerPerson,
        }])
        .select();

      if (insertEventError) {
        console.error('Error creating event:', insertEventError);
      } else {
        // console.log(insertEventData[0].link);
        // const baseUrl = "http://localhost:3000/join/";
        // const uniqueUrl = `${baseUrl}${insertEventData[0].link}`;
        const res = await updateJoinersTable(insertEventData[0].event_id, user.user_id);
        if (res === 0) {
          navigate(`/`);
        }
      }
      

    } else {
      console.log("no tables available");
      setTableError("Error: There is no table that can accomodate the number of seats requested");
    }

    
  };

  const updateJoinersTable = async (eventId, joinerUserId) => {
    const { data, error } = await supabase
      .from('joiners')
      .insert([{
        event_id: eventId,
        joiner_user_id: joinerUserId,
        response: "yes",
      }]);
    
    if (error) {
      console.log(error);
      return -1;
    } else {
      return 0;
    }
  }
  
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

  // Convert to timestamp with time zone
  function convertToTimestampWithTimezone(dateString, timeString, timezone) {
    // Combine date and time into a single string and parse with Luxon
    const dt = DateTime.fromFormat(`${dateString} ${timeString}`, 'yyyy-MM-dd h:mm a', { zone: timezone });
    // Return the timestamp
    
    return dt.toString();
    
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
        {tableError && <Typography color="error"> {tableError} </Typography>}
        <Button variant="contained" color="primary" type="submit">Create Event</Button>
      </form>
    </div>
  );
};

export default CreateEvent;

/*
const reservationStart = new Date('2024-09-19T18:00:00');
const reservationEnd = new Date(reservationStart.getTime() + 2 * 60 * 60 * 1000);  // Adds 2 hours

const { data: newReservation, error: reservationError } = await supabase
  .from('reservations')
  .insert([{
    customer_id: customerId,
    restaurant_id: restaurantId,
    table_id: selectedTableId,
    reservation_start: reservationStart.toISOString(),
    reservation_end: reservationEnd.toISOString(),
    status: 'Confirmed'
  }]);

if (reservationError) {
  console.error('Error inserting reservation:', reservationError);
}

*/
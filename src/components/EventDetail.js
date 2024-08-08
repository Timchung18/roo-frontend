import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, Link } from '@mui/material';
import {supabase} from '../supabaseClient';

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [restaurant, setRestaurant] = useState(null);

  const baseUrl = "http://localhost:3000/event/";
  const uniqueUrl = `${baseUrl}`;

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', eventId)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
      } else {
        setEvent(data);
      }
    };

    const fetchRestaurant = async () => {
      const { tableData, tableError } = await supabase
        .from('tables')
        .select('*')
        .eq('table_id', event.table_id)
        .single();
      
      if (tableError) {
        console.error('Error fetching table:', tableError);
      } else {
        const {restaurantData, restaurantError} = await supabase
          .from('restaurants')
          .select('*')
          .eq('restaurant_id', tableData[0].restaurant_id);
        if (restaurantError) {
          console.error('Error fetching restaurant:', restaurantError);
        } else {
          console.log(restaurantData[0]);
          setRestaurant(restaurantData[0]);
        }
      }
    };
    
   
    fetchEvent();
    // fetchRestaurant();
  }, []);

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '400px', // adjust based on your needs
    display: 'block',
    margin: '0 auto', // Center the image
};

  return (
    <Box padding={3} textAlign="center">
      {/* This will be the restaurant name <Typography variant="h4">{event.title}</Typography> */}
      <Typography variant="body1">{new Date(event.event_date).toLocaleDateString()}</Typography>
      <Typography variant="body1">{event.event_description}</Typography>
      {/* {event.image && <img src={event.image} style={imageStyles}/>} */}
      <Box marginTop={2}>
        <Typography variant="body1">Who's going?</Typography>
        <Typography variant="body2">{`${event.number_of_seats_taken} / ${event.number_of_seats_requested} Spots Reserved`}</Typography>
        <Typography variant="body2">{`RSVP Fee $0`}</Typography>
        <Typography variant="body1">Restaurant: </Typography>
        <Typography variant="body2">Restaurant Address: </Typography>
        {/* <Typography variant="body1" marginTop={2}>You've raised $0</Typography> */}
        {/* <Link to={`${baseUrl}${event.link}`}>Invite link</Link> */}
        {/* <Button variant="contained" color="primary" style={{ marginTop: 10 }}>Send invites</Button> */}
      </Box>
    </Box>
  );
};

export default EventDetail;

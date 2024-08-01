import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import {supabase} from '../supabaseClient';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching event:', error);
      } else {
        setEvent(data);
      }
    };

    const fetchInvitation = async () => {
      const {data, error} = await supabase
        .from('invitations')
        .select('x')
        .eq('id')

    };

    fetchEvent();
  }, [id]);

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
      <Typography variant="h4">{event.title}</Typography>
      <Typography variant="body1">{new Date(event.date).toLocaleDateString()}</Typography>
      <Typography variant="body1">{event.event_description}</Typography>
      {event.image && <img src={event.image} style={imageStyles}/>}
      <Box marginTop={2}>
        <Typography variant="body1">Who's going?</Typography>
        <Typography variant="body2">{`0/${event.min_number_of_attendees} Spots Reserved`}</Typography>
        <Typography variant="body2">{`RSVP Fee $${event.funding_per_person}`}</Typography>
        <Typography variant="body1" marginTop={2}>You've raised $0</Typography>
        <Button variant="contained" color="primary" style={{ marginTop: 10 }}>Send invites</Button>
      </Box>
    </Box>
  );
};

export default EventDetail;

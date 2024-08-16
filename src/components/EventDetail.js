import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { supabase } from '../supabaseClient';

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [userContribution, setUserContribution] = useState(0);
  const [userId, setUserId] = useState(null);

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
        fetchAttendance(data.event_id); // Fetch attendance when event data is available
      }
    };

    const fetchAttendance = async (event_id) => {
      const userId = supabase.auth.user().id;
      setUserId(userId);

      const { data, error } = await supabase
        .from('rsvp')
        .select('*')
        .eq('event_id', event_id)
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching attendance:', error);
      } else {
        setAttendance(data.attendance_status);
        setUserContribution(data.amount_contributed);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleAttendanceChange = async (event) => {
    const newStatus = event.target.value;

    const { data, error } = await supabase
      .from('rsvp')
      .update({ attendance_status: newStatus })
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating attendance:', error);
    } else {
      setAttendance(newStatus);
    }
  };

  if (!event) {
    return <Typography>Loading...</Typography>;
  }

  const imageStyles = {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '400px',
    display: 'block',
    margin: '0 auto',
  };

  return (
    <Box padding={3} textAlign="center">
      <Typography variant="h4">{event.title}</Typography>
      <Typography variant="body1">{new Date(event.event_date).toLocaleDateString()}</Typography>
      <Typography variant="body1">{event.event_description}</Typography>
      {event.image && <img src={event.image} style={imageStyles} />}
      <Box marginTop={2}>
        <Typography variant="body1">Who's going?</Typography>
        <Typography variant="body2">{`${event.number_of_seats_taken} / ${event.number_of_seats_requested} Spots Reserved`}</Typography>
        <Typography variant="body2">{`RSVP Fee $0`}</Typography>
        <Typography variant="body1">Your Attendance:</Typography>
        <FormControl component="fieldset">
          <RadioGroup row value={attendance || ''} onChange={handleAttendanceChange}>
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
            <FormControlLabel value="maybe" control={<Radio />} label="Maybe" />
          </RadioGroup>
        </FormControl>
        <Typography variant="body1" marginTop={2}>You've contributed: ${userContribution.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export default EventDetail;

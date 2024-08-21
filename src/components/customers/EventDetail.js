import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { supabase } from '../../supabaseClient';

const EventDetail = ({user}) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [userContribution, setUserContribution] = useState(0);
  // const [userId, setUserId] = useState(null);

  const [rsvpStatus, setRsvpStatus] = useState('Maybe'); // Default status
  const [isEditing, setIsEditing] = useState(false);
  const [newRsvpStatus, setNewRsvpStatus] = useState(rsvpStatus);

  // Handlers for entering and saving edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRsvpChange = (status) => {
    setNewRsvpStatus(status);
  };

  const handleSaveClick = () => {
    setRsvpStatus(newRsvpStatus);
    setIsEditing(false);

    const updateJoiners = async () => {
      const {data, error} = await supabase
        .from('joiners')
        .update({ rsvp_status: newRsvpStatus })
        .eq('joiner_user_id', user.user_id)
        .eq('event_id', eventId);

      if (error) {
        console.error('Error updating RSVP status:', error.message);
      } else {
        console.log('RSVP status updated successfully');
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewRsvpStatus(rsvpStatus);
  };

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
      const { data, error } = await supabase
        .from('joiners')
        .select('*')
        .eq('event_id', event_id);
      
      if (error) {
        console.error('Error fetching attendance:', error);
      } else {
        setAttendance(data[0]);
        
      }
    };

    fetchEvent();
  }, []);

  // const handleAttendanceChange = async (event) => {
  //   const newStatus = event.target.value;

  //   const { data, error } = await supabase
  //     .from('rsvp')
  //     .update({ attendance_status: newStatus })
  //     .eq('event_id', eventId)
  //     .eq('user_id', userId);

  //   if (error) {
  //     console.error('Error updating attendance:', error);
  //   } else {
  //     setAttendance(newStatus);
  //   }
  // };

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
      <Typography variant="h4">{event.description}</Typography>
      <Typography variant="body1">{new Date(event.event_date_time).toLocaleDateString()}</Typography>
      <Typography variant="body1">{new Date(event.event_date_time).toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true})}</Typography>
      <Typography variant="body1">{event.event_description}</Typography>
      {event.image && <img src={event.image} style={imageStyles} />}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Current RSVP Status: <span style={{ color: rsvpStatus === 'Yes' ? 'green' : rsvpStatus === 'No' ? 'red' : 'orange' }}>{rsvpStatus}</span></h3>
        {!isEditing ? (
          <button onClick={handleEditClick} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>Edit RSVP</button>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div>
              <button
                onClick={() => handleRsvpChange('Yes')}
                style={{
                  backgroundColor: newRsvpStatus === 'Yes' ? 'green' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleRsvpChange('No')}
                style={{
                  backgroundColor: newRsvpStatus === 'No' ? 'red' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
              <button
                onClick={() => handleRsvpChange('Maybe')}
                style={{
                  backgroundColor: newRsvpStatus === 'Maybe' ? 'orange' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                Maybe
              </button>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSaveClick} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Save</button>
              <button onClick={handleCancelClick} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
        <Box marginTop={2}>
          <Typography variant="body1">Who's going?</Typography>
          <Typography variant="body2">{`${event.number_of_seats_taken} / ${event.number_of_seats_requested} Spots Reserved`}</Typography>
          <Typography variant="body2">{`RSVP Fee $0`}</Typography>
          <Typography variant="body1" marginTop={2}>You've contributed: ${userContribution.toFixed(2)}</Typography>
        </Box>
      </div>
    </Box>
  );
};

export default EventDetail;

/*
const RsvpPage = () => {
  // State for managing RSVP status and edit mode
  const [rsvpStatus, setRsvpStatus] = useState('Maybe'); // Default status
  const [isEditing, setIsEditing] = useState(false);
  const [newRsvpStatus, setNewRsvpStatus] = useState(rsvpStatus);

  // Handlers for entering and saving edit mode
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRsvpChange = (status) => {
    setNewRsvpStatus(status);
  };

  const handleSaveClick = () => {
    setRsvpStatus(newRsvpStatus);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewRsvpStatus(rsvpStatus);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Event Title</h2>
      <p>Date: August 25, 2024</p>
      <p>Time: 6:00 PM</p>
      <p>Location: Downtown Conference Center</p>

      <div style={{ marginTop: '20px' }}>
        <h3>Current RSVP Status: <span style={{ color: rsvpStatus === 'Yes' ? 'green' : rsvpStatus === 'No' ? 'red' : 'orange' }}>{rsvpStatus}</span></h3>
        {!isEditing ? (
          <button onClick={handleEditClick} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>Edit RSVP</button>
        ) : (
          <div style={{ marginTop: '20px' }}>
            <div>
              <button
                onClick={() => handleRsvpChange('Yes')}
                style={{
                  backgroundColor: newRsvpStatus === 'Yes' ? 'green' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleRsvpChange('No')}
                style={{
                  backgroundColor: newRsvpStatus === 'No' ? 'red' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                No
              </button>
              <button
                onClick={() => handleRsvpChange('Maybe')}
                style={{
                  backgroundColor: newRsvpStatus === 'Maybe' ? 'orange' : 'lightgray',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer'
                }}
              >
                Maybe
              </button>
            </div>
            <div style={{ marginTop: '10px' }}>
              <button onClick={handleSaveClick} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Save</button>
              <button onClick={handleCancelClick} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RsvpPage; */

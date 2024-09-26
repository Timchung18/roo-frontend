import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Box, LinearProgress, Button } from '@mui/material';
import { MapPin, Calendar } from "lucide-react"
import { DateTime } from 'luxon';
import { supabase } from '../../supabaseClient';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from './CheckoutForm';
import BackButton from '../backButton';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLIC_KEY);

const EventDetail = ({user}) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("none");
  const [seatsTaken, setSeatsTaken] = useState(0);

  const [rsvpStatus, setRsvpStatus] = useState('Maybe'); // Default status
  const [isEditing, setIsEditing] = useState(false);
  const [newRsvpStatus, setNewRsvpStatus] = useState(rsvpStatus);
  const [canPay, setCanPay] = useState(false);
  const [canEdit, setCanEdit] = useState(true);

  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  
  // Handlers for entering and saving edit mode
  const updateJoiners = async () => {
    const {data, error} = await supabase
      .from('joiners')
      .upsert({ 
        response: newRsvpStatus.toLowerCase(),
        event_id : event.event_id,
        joiner_user_id : user.user_id, 
      }, {
        onConflict: ['joiner_user_id', 'event_id']// Ensure that the upsert is based on the combination of user_id and event_id
      });
    
    if (newRsvpStatus.toLowerCase() === "yes") {
      const {data: eventSeatData, error: eventSeatError} = await supabase
      .from('events')
      .update({ number_of_seats_taken: event.number_of_seats_taken + 1 })
      .eq('event_id', event.event_id);

      if (eventSeatError) {
        console.error('Error updating events table, number of seats taken: ', eventSeatError.message);
      } else {
        console.log('Update events table successful');
        setSeatsTaken(seatsTaken + 1);
      }

    }
      
    if (error) {
      console.error('Error updating RSVP status:', error.message);
    } else {
      console.log('RSVP status updated successfully');
    }
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRsvpChange = (status) => {
    setNewRsvpStatus(status);
  };

  const handleSaveClick = () => {
    setRsvpStatus(newRsvpStatus);
    setIsEditing(false);

    
    if (newRsvpStatus === "No" || newRsvpStatus === "Maybe") {
      updateJoiners();
      setCanPay(false);
    } else {
      setCanPay(true);
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
        console.log(data);
        setSeatsTaken(data.number_of_seats_taken);
        // fetchAttendance(data.event_id); // Fetch attendance when event data is available
        await fetchRestaurant(data.restaurant_id);
        await fetchRsvp();
      }
    };

    const fetchRsvp = async () => {
      const { data, error } = await supabase
        .from('joiners')
        .select('*')
        .eq('event_id', eventId)
        .eq('joiner_user_id', user.user_id);
      
      if (error) {
        console.error('Error fetching attendance:', error);
      } else {
        if (data.length === 0) {
          setRsvpStatus("No response");
        } else {
          const resp = data[0].response;
          if (resp === "yes") {
            setRsvpStatus("Yes");
            setCanEdit(false);
          } else if (resp === "no") {
            setRsvpStatus("No");
          } else {
            setRsvpStatus("Maybe");
          }
        }
      }
    };

    const fetchRestaurant = async (restaurant_id) => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('restaurant_id', restaurant_id);
      
      if (error) {
        console.error('Error fetching restaurant data:', error);
      } else {
        setRestaurant(data[0]);
        console.log(restaurant);
      }
    };
    
    console.log(user);
    fetchEvent();
  }, []);


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

  // Format the date string
  const formatDate = (eventDateTime) => {
    const dateTime = DateTime.fromISO(eventDateTime).setZone('America/Los_Angeles');
    return dateTime.toFormat('cccc, MMMM dd, yyyy');
  };

  const formatTime = (eventDateTime) => {
    const dateTime = DateTime.fromISO(eventDateTime).setZone('America/Los_Angeles');
    return dateTime.toFormat('hh:mm a');
  };


  return (
    <Box padding={3} margin="0 auto" textAlign="left" maxWidth="600px">
      <BackButton/>
      <Typography margin="10px auto" variant="h4" fontWeight="bold">{event.description}</Typography>
      <Box display="flex" justifyContent="left" alignItems="center" marginTop={1}>
        <Calendar size={20} />
        <Typography variant="body1" marginLeft={1}>
          {formatDate(event.event_date_time)}, {formatTime(event.event_date_time)}
        </Typography>
      </Box>
      {restaurant && (
        <Box display="flex" justifyContent="left" alignItems="center" marginTop={1}>
          <MapPin size={20} />
          <Typography variant="body1" marginLeft={1}>{restaurant.name}, {restaurant.address}</Typography>
        </Box>
      )}
      
      {event.image && <img src={event.image} style={imageStyles} />}
      <Box marginTop={2}>
        <Typography variant="h5" fontWeight="550" letterSpacing={1}>Who's going?</Typography>
        <Typography variant="body2">{`${seatsTaken} / ${event.number_of_seats_requested} Spots Reserved`}</Typography>
        
        <LinearProgress
          variant="determinate"
          value={(event.number_of_seats_taken / event.number_of_seats_requested) * 100}
          sx={{ height: 10, borderRadius: 5, bgcolor: 'lightgray', '& .MuiLinearProgress-bar': { bgcolor: '#F28934' } }}
        />
      </Box>
      
      <Box marginTop={2}>
        {restaurant && (
          <Box marginTop={1}>
            <Typography variant="h5" display="inline" fontWeight="550" letterSpacing={1}>RSVP Fee </Typography>
            <Typography variant="h5" display="inline" > {`$${event.funding_per_person ? event.funding_per_person : restaurant.price_per_seat}`}</Typography>
          </Box>
        )}
        <Typography variant="h5" display="inline" marginTop={4} fontWeight="550" letterSpacing={1}>You've raised: </Typography>
        <Typography variant="h5" display="inline">{`$${(event.funding_per_person * event.number_of_seats_taken).toFixed(2)}`}</Typography>
      </Box>

      <Box marginTop={4} display="flex" justifyContent="center" alignItems="center" flexDirection="column">
        <Typography variant="h5">RSVP Status: <span style={{ color: rsvpStatus === 'Yes' ? 'green' : rsvpStatus === 'No' ? 'red' : 'orange' }}>{rsvpStatus}</span></Typography>
        { canEdit && 
        <Box>
        {(!isEditing ) ? (
          <button onClick={handleEditClick} style={{ padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>Edit RSVP</button>
        ) : (
          <Box marginTop={2}>
            <Box>
              <button
                onClick={() => handleRsvpChange('Yes')}
                style={{
                  backgroundColor: newRsvpStatus === 'Yes' ? '#F28934' : '#FFA500' ,
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  border: 'none',
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleRsvpChange('No')}
                style={{
                  backgroundColor: newRsvpStatus === 'No' ? '#F28934' : '#FFA500',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  border: 'none',
                }}
              >
                No
              </button>
              <button
                onClick={() => handleRsvpChange('Maybe')}
                style={{
                  backgroundColor: newRsvpStatus === 'Maybe' ? '#F28934' : '#FFA500',
                  color: 'white',
                  padding: '10px 20px',
                  margin: '5px',
                  cursor: 'pointer',
                  borderRadius: '50px',
                  border: 'none',
                }}
              >
                Maybe
              </button>
            </Box>
            <Box marginTop={2}>
              <button onClick={handleSaveClick} style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>Save</button>
              <button onClick={handleCancelClick} style={{ padding: '10px 20px', cursor: 'pointer' }}>Cancel</button>
            </Box>
          </Box>
        )}
        </Box>
        }
      </Box>

      {canPay && 
        <Elements stripe={stripePromise}>
          <CheckoutForm setCanEdit={setCanEdit} updateJoiners={updateJoiners} setPaymentStatus={setPaymentStatus} />      
        </Elements>
      }
      
    </Box>
  );
};

export default EventDetail;

import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import {supabase} from '../supabaseClient';

const Home = ({user}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [hostingEvents, setHostingEvents] = useState([]);
  const [joiningEvents, setJoiningEvents] = useState([]);

  useEffect(() => {
    const fetchHostingEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_user_id',userId)
        .order('event_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setHostingEvents(data);
      }
    };

    const fetchEventsJoinedByUser = async () => {
      let { data, error } = await supabase
      .from('events')
      .select('*, joiners!inner(event_id)')
      .eq('joiners.joiner_user_id', userId)
      .order('event_date', {ascending: true});
    
      if (error) {
        console.error('Error fetching events:', error)
      } else {
        console.log('Events joined by user:', data);
        setJoiningEvents(data);
      }
    }
    
    fetchEventsJoinedByUser();
    fetchHostingEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate(`/create-event`);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Hello {user.first_name}</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleCreateEvent}
        style={{ marginTop: 20, marginBottom: 20 }}
      >
        Create New Event
      </Button>
      <Typography variant="h6">Hosting Events</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
        {hostingEvents.map(event => (
          <Link to={`/event/${event.event_id}`} key={event.event_id} style={{ textDecoration: 'none' }}>
            <Card style={{ width: 300 }}>
              {/* <img src="path_to_image" alt="event" style={{ width: '100%' }} /> */}
              <CardContent>
                <Typography variant="body2">{new Date(event.event_date).toLocaleDateString()}</Typography>
                <Typography variant="body2">{event.description}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Typography variant="h6">Joined Events</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
        {joiningEvents.map(event => (
          <Link to={`/event/${event.event_id}`} key={event.event_id} style={{ textDecoration: 'none' }}>
            <Card style={{ width: 300 }}>
              {/* <img src="path_to_image" alt="event" style={{ width: '100%' }} /> */}
              <CardContent>
                <Typography variant="body2">{new Date(event.event_date).toLocaleDateString()}</Typography>
                <Typography variant="body2">{event.description}</Typography>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

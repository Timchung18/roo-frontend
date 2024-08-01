import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography } from '@mui/material';
import {supabase} from '../supabaseClient';

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        console.error('Error fetching events:', error);
      } else {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4">Hello Tim</Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 20 }}>
        {events.map(event => (
          <Link to={`/event/${event.id}`} key={event.id} style={{ textDecoration: 'none' }}>
            <Card style={{ width: 300 }}>
              {/* <img src="path_to_image" alt="event" style={{ width: '100%' }} /> */}
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography variant="body2">{new Date(event.date).toLocaleDateString()}</Typography>
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

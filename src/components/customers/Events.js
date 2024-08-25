import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import {supabase} from '../../supabaseClient';
import { DateTime } from 'luxon';

const Events = ({user}) => {
  const userId = user.user_id;
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

  const formatDate = (dateTime) => {
    console.log(dateTime); 
  }

  return (
    <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto p-6">
      

      <div class="relative bg-cover bg-center h-64 rounded-lg shadow-lg ">
            <div class="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div class="absolute top-1/4 left-4">
                <h1 class="text-5xl text-white font-bold">Hello</h1>
                <Typography variant="h4">{user.first_name}</Typography>
            </div>
        </div>
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
    </div>
  );
};

export default Events;
{/* <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="relative bg-white shadow-md p-4">
        <div class="container mx-auto flex justify-between items-center">
            <div class="text-lg font-bold">Menu</div>
            <button class="rounded-full p-2 bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto p-6">
        <div class="relative bg-cover bg-center h-64 rounded-lg shadow-lg" style="background-image: url('path_to_your_image.jpg');">
            <div class="absolute inset-0 bg-black opacity-50 rounded-lg"></div>
            <div class="absolute top-1/4 left-4">
                <h1 class="text-5xl text-white font-bold">Hello</h1>
                <p class="text-3xl text-white">Tim</p>
            </div>
        </div>

        <!-- Events Section -->
        <div class="mt-10">
            <h2 class="text-2xl font-semibold mb-4">Your events</h2>
            <div class="bg-white rounded-lg shadow-md p-4 flex">
                <div class="relative w-1/4 h-32 bg-cover bg-center rounded-lg" style="background-image: url('path_to_your_event_image.jpg');"></div>
                <div class="ml-4 flex-1">
                    <div class="flex justify-between items-center mb-2">
                        <span class="bg-orange-500 text-white text-xs font-semibold rounded-full px-3 py-1">August 31, 2024</span>
                        <span class="text-gray-500 text-sm font-semibold">Hosting</span>
                    </div>
                    <h3 class="text-lg font-semibold">Lunch Get together</h3>
                    <p class="text-gray-500">Pizza Hut</p>
                </div>
            </div>
        </div>
    </div>
</div> */}

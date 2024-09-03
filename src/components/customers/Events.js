import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import {supabase} from '../../supabaseClient';
import { useUser } from '../UserContext';
import { DateTime } from 'luxon';

const Events = () => {
  // const userId = user.user_id;
  const { user } = useUser();
  const navigate = useNavigate();
  const [hostingEvents, setHostingEvents] = useState([]);
  const [joiningEvents, setJoiningEvents] = useState([]);

  useEffect(() => {
    const fetchHostingEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('host_user_id', user.user_id)
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
      .eq('joiners.joiner_user_id', user.user_id)
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

  const formatDate = (eventDateTime) => {
    const dateTime = DateTime.fromISO(eventDateTime).setZone('America/Los_Angeles');
    return dateTime.toFormat('ccc, MMMM dd, yyyy');
  };

  const formatTime = (eventDateTime) => {
    const dateTime = DateTime.fromISO(eventDateTime).setZone('America/Los_Angeles');
    return dateTime.toFormat('hh:mm a');
  };

  return (
    // <div className="min-h-screen bg-gray-100">
    // <div className="container mx-auto p-6">
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Align the whole content box in the center
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Box 
        sx={{
          width: {
            xs: '90%',   // 90% width on small screens
            sm: '80%',   // 80% width on larger screens
            md: '60%',   // 60% width on medium screens and above
          },
          maxWidth: '600px',  // Max width for the content box
          padding: '20px',    // Padding inside the box
          backgroundColor: 'white',  // Optional: Box background color
          borderRadius: '8px',  // Optional: Rounded corners
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          
        }}
      >
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align text to the left inside the box
            padding: '20px',
            justifyContent: 'center',
            width: '100%',
            height: '300px', // Adjust the height as needed
            backgroundImage: 'url(/rallyhorizonImage.jpg)', 
            backgroundSize: 'cover', // Make sure the image covers the entire box
            backgroundPosition: 'center', // Center the image
            color: 'white', // Text color
            borderRadius: '8px', // Match the border radius to the parent box
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ fontWeight: 530, fontSize: '2.8rem', letterSpacing: '0.04em' }}
          >
            Hello
          </Typography>
          <Typography 
            variant="h5" 
            component="h1"
          >
            {user.first_name}
          </Typography>
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleCreateEvent}
          sx={{ marginTop: 3, marginBottom: 3 }} // Consistent margin using MUI spacing
        >
          Create New Event
        </Button>

        <Typography variant="h6">Hosting Events</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // 1 column on xs, 2 columns on sm and larger
            gap: 1, // Consistent gap between cards
            
            width: '100%',
            px: '15px',
            
          }}
        >
          {hostingEvents.map(event => (
            <Link 
              to={`/event/${event.event_id}`} 
              key={event.event_id} 
              style={{ textDecoration: 'none' }}
            >
              <Card 
                sx={{
                  borderRadius: '12px',  // Rounded corners
                  overflow: 'hidden',  // Ensures content stays within rounded borders
                  display: 'flex',
                  flexDirection: 'column',
                  height: '200px',  // Make sure the card takes the full height
                }}
              >
                <Box
                  sx={{
                    height: '70%',  // Adjust height for the image section
                    backgroundImage: `url(/rallyhorizonImage.jpg)`,  // Use event-specific image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Chip
                      label={formatDate(event.event_date_time)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>
                
                <CardContent
                  sx={{
                    backgroundColor: 'white', // White background for the text section
                    color: 'black',  // Black text color for contrast
                    padding: '16px', // Padding around the text content
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '30%',
                  }}
                >
                  {/* <Typography variant="body2">
                    {new Date(event.event_date).toLocaleDateString()}
                  </Typography> */}
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" >
                    {event.description}
                  </Typography>
                </CardContent>

                
              </Card>
            </Link>
          ))}
        </Box>

        <Typography variant="h6" sx={{ marginTop: 3 }}>Joined Events</Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, // 1 column on xs, 2 columns on sm and larger
            gap: 1, // Consistent gap between cards
            
            width: '100%',
            px: '15px',
            
          }}
          
        >
          {joiningEvents.map(event => (
            <Link 
              to={`/event/${event.event_id}`} 
              key={event.event_id} 
              style={{ textDecoration: 'none' }}
            >
              <Card 
                sx={{
                  borderRadius: '12px',  // Rounded corners
                  overflow: 'hidden',  // Ensures content stays within rounded borders
                  display: 'flex',
                  flexDirection: 'column',
                  height: '200px',  // Make sure the card takes the full height
                }}
              >
                <Box
                  sx={{
                    height: '70%',  // Adjust height for the image section
                    backgroundImage: `url(/rallyhorizonImage.jpg)`,  // Use event-specific image
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <Box sx={{ padding: '10px' }}>
                    <Chip
                      label={formatDate(event.event_date_time)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>
                
                <CardContent
                
                  sx={{
                    backgroundColor: 'white', // White background for the text section
                    color: 'black',  // Black text color for contrast
                    padding: '16px', // Padding around the text content
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: '30%',
                  }}
                >
                  {/* <Typography variant="body2">
                    {new Date(event.event_date).toLocaleDateString()}
                  </Typography> */}
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {event.description}
                  </Typography>
                  <Typography variant="body2" >
                    {event.description}
                  </Typography>
              </CardContent>
            </Card>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
    // </div>
    // </div>
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

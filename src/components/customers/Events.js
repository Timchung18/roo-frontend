import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import {supabase} from '../../supabaseClient';
import { DateTime } from 'luxon';

const Events = ({user}) => {
  // const userId = user.user_id;
  // const { user } = useUser();
  const navigate = useNavigate();
  const [hostingEvents, setHostingEvents] = useState([]);
  const [joiningEvents, setJoiningEvents] = useState([]);
  const rsvpMap = {
    'yes': 'Going',
    'no': 'Declined',
    'maybe': 'Maybe'
  };
  

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
        .from('joiners')
        .select(`
          joiner_id,
          joiner_user_id,
          response,
          event_id,
          eventDetails:events (
            event_id,
            description,
            event_date_time
          )
        `)
        .eq('joiner_user_id', user.user_id);

      if (error) {
        console.log(error);
      } else {
        if (data) {
          // Sort by event_date_time in ascending order
          data.sort((a, b) => new Date(a.eventDetails.event_date_time) - new Date(b.eventDetails.event_date_time));
        }
        console.log(data);
        setJoiningEvents(data);
      }

      // let { data: tempData, error: tempError } = await supabase
      // .from('events')
      // .select('*, joiners!inner(event_id)')
      // .eq('joiners.joiner_user_id', user.user_id)
      // .order('event_date', {ascending: true});
      
      // if (tempError) {
      //   console.error('Error fetching events:', tempError)
      // } else {
      //   console.log('Events joined by user:', tempData);
      //   // setJoiningEvents(data);
      // }
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
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',  // Align items to the left and right
                      padding: '10px',
                      width: '100%',
                    }}
                  >
                    <Chip
                      label={formatDate(event.event_date_time)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    />
                    <Chip
                      label='Going'
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      backgroundColor: 'black',
                      color: 'white',
                      padding: '4px 8px',
                      borderTopLeftRadius: '8px',  // Rounded top-left corner
                      fontSize: '15px',  // Adjust the size of the text as needed
                      fontWeight: '600',
                    }}
                  >
                    Hosting
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
                  <Typography variant="h6" component="div" sx={{ fontWeight: '400' }}>
                    {event.description}
                  </Typography>
                  {/* <Typography variant="body2" >
                    {event.description}
                  </Typography> */}
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
          {joiningEvents.map(rsvpResponse => (
            <Link 
              to={`/event/${rsvpResponse.event_id}`} 
              key={rsvpResponse.event_id} 
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
                  <Box 
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',  // Align items to the left and right
                      padding: '10px',
                      width: '100%',
                    }}
                  >
                    <Chip
                      label={formatDate(rsvpResponse['eventDetails']['event_date_time'])}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    />

                    <Chip
                      label={rsvpMap[rsvpResponse.response]}
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
                  <Typography variant="h6" component="div" sx={{ fontWeight: '500' }}>
                    {rsvpResponse['eventDetails']['description']}
                  </Typography>
                  {/* <Typography variant="body2" >
                    {event.description}
                  </Typography> */}
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


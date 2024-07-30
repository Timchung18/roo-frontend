// src/Events.js

import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    let { data: events, error } = await supabase
      .from('events')
      .select('*');

    if (error) console.error('Error fetching events:', error);
    else setEvents(events);
  };

  return (
    <div>
      <h1>Events</h1>
      <ul>
        {events.map(event => (
          <li key={event.id}>{event.event_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Events;

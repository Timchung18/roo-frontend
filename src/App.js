import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Events from './components/customers/Events';
import EventDetail from './components/customers/EventDetail';
import Login from './components/customers/Login';
import CreateEvent from './components/customers/CreateEvent';
import RestaurantHomePage from './components/restaurants/RestaurantHomePage';
import CreateTable from './components/restaurants/CreateTable';
import RestaurantLogin from './components/restaurants/RestaurantLogin';
import { useState } from 'react';
import { Restaurant } from '@mui/icons-material';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [restaurantUser, setRestaurantUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/events`} /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login  user={user} setUser={setUser}/>} />

        <Route path="/events" element={user ? <Events user={user}/> : <Navigate to="/login" />} />
        <Route path="/event/:eventId" element={user ? <EventDetail user={user}/> : <Navigate to="/login" />} />
        <Route path="/create-event" element={user ? <CreateEvent user={user}/> : <Navigate to="/login" />} />

        <Route path="/restaurant/login" element={<RestaurantLogin setRestaurantUser={setRestaurantUser}/> } />
        <Route path="/restaurant/:restaurantId" element={restaurantUser ? <RestaurantHomePage/> : <Navigate to="/login"/>} />
        <Route path="/restaurant/createTable" element={<CreateTable user={restaurantUser} />} />
        
      </Routes>
    </Router>
  );
}

export default App;


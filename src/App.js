import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Events from './components/customers/Events';
import EventDetail from './components/customers/EventDetail';
import Login from './components/customers/Login';
import CreateEvent from './components/customers/CreateEvent';
import RestaurantHomePage from './components/restaurants/RestaurantHomePage';
import CreateTable from './components/restaurants/CreateTable';
import RestaurantLogin from './components/restaurants/RestaurantLogin';
import { useState } from 'react';
import { Restaurant } from '@mui/icons-material';
import { UserProvider } from './components/UserContext';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurantUser, setRestaurantUser] = useState(null);

  return (
    <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? `/events` : "/login"} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

        <Route path="/events" element={isAuthenticated ? <Events /> : <Navigate to="/login" />} />
        <Route path="/event/:eventId" element={isAuthenticated ? <EventDetail /> : <Navigate to="/login" />} />
        <Route path="/create-event" element={isAuthenticated ? <CreateEvent /> : <Navigate to="/login" />} />

        <Route path="/restaurant/login" element={<RestaurantLogin setRestaurantUser={setRestaurantUser}/> } />
        <Route path="/restaurant/:restaurantId" element={restaurantUser ? <RestaurantHomePage/> : <Navigate to="/restaurant/login"/>} />
        <Route path="/restaurant/createTable" element={<CreateTable user={restaurantUser} />} />
      </Routes>
    </Router>
  </UserProvider>
  );
}

export default App;


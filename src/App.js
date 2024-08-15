import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';
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
        <Route path="/" element={user ? <Navigate to={`/home/${user.id}`} /> : <Navigate to="/login" />} />
        <Route path="/home/:userId" element={user ? <Home user={user}/> : <Navigate to="/login" />} />
        <Route path="/event/:eventId" element={user ? <EventDetail /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login  setUser={setUser}/>} />
        <Route path="/create-event" element={user ? <CreateEvent user={user}/> : <Navigate to="/login" />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantHomePage/>} />
        <Route path="/restaurant/createTable" element={<CreateTable user={restaurantUser} />} />
        <Route path="/restaurant/login" element={<RestaurantLogin setRestaurantUser={setRestaurantUser}/> } />
      </Routes>
    </Router>
  );
}

export default App;


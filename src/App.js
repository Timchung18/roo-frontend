import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import CreateEvent from './components/CreateEvent';
import { useState } from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/home/${user.id}`} /> : <Navigate to="/login" />} />
        <Route path="/home/:userId" element={user ? <Home user={user}/> : <Navigate to="/login" />} />
        <Route path="/event/:eventId" element={user ? <EventDetail /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login  setUser={setUser}/>} />
        <Route path="/create-event" element={user ? <CreateEvent user={user}/> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;


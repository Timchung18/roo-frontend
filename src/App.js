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
import useUser from './components/useUser';

function App() {
  const [user, setUser] = useUser('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const { setIsAuthenticated, isAuthenticated} = useUser();
  const [restaurantUser, setRestaurantUser] = useUser('restaurantUser');

  return (
    // <UserProvider>
      <Router>
      <Routes>
        <Route path="/" element={<Navigate to={user ? `/events` : "/login"} />} />
        {/* <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>} /> */}
        <Route path="/login" element={<Login setUser={setUser}/>} />

        <Route path="/events" element={user ? <Events user={user}/> : <Navigate to="/login" />} />
        <Route path="/event/:eventId" element={user ? <EventDetail user={user}/> : <Navigate to="/login" />} />
        <Route path="/create-event" element={isAuthenticated ? <CreateEvent user={user}/> : <Navigate to="/login" />} />

        <Route path="/restaurant/login" element={<RestaurantLogin setRestaurantUser={setRestaurantUser}/> } />
        <Route path="/restaurant/:restaurantId" element={restaurantUser ? <RestaurantHomePage user={restaurantUser} /> : <Navigate to="/restaurant/login"/>} />
        <Route path="/restaurant/createTable" element={restaurantUser ? <CreateTable user={restaurantUser} /> : <Navigate to="/restaurant/login"/>} />
      </Routes>
      </Router>
    // </UserProvider> 
  );
}

export default App;
// export default function WrappedApp() {
//   return (
//     <UserProvider>
//       <App />
//     </UserProvider>
//   );
// }


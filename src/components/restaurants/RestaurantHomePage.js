import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import ReservationTimeline from './ReservationTimeline';

const RestaurantHomePage = ({user}) => {
  const [restaurant, setRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurant information and tables
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const owner_user_id = user.user_id; // Replace with dynamic ID if needed

        // Fetch restaurant information
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('owner_user_id', owner_user_id)
          .single();

        if (restaurantError) throw restaurantError;

        setRestaurant(restaurantData);
        await fetchEventsAndTables(restaurantData);
        console.log(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  
  const fetchEventsAndTables = async (restaurantData) => {
    try {
      const restaurantId = restaurantData.restaurant_id; 

      // Fetch events information
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('table_id');

      if (eventError) throw eventError;
      
      setEvents(eventData);
      console.log(eventData);
      // Fetch tables associated with the restaurant
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (tablesError) throw tablesError;

      setTables(tablesData);
      console.log(tablesData);
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventsOfDay = async (date) => {
    try {
      const restaurantId = restaurant.restaurant_id; 

      // Fetch events information
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .gte('event_date_time', `${date}T00:00:00`)  // Start of the day
        .lte('event_date_time', `${date}T23:59:59`)  // End of the day
        .order('table_number');

      if (eventError) throw eventError;
      
      setEvents(eventData);
      
      // Fetch tables associated with the restaurant
      const { data: tablesData, error: tablesError } = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (tablesError) throw tablesError;

      setTables(tablesData);
    } catch (err) {
      setError(err.message);
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  


  if (loading) return <p>Loading restaurant data...</p>;
  if (error) return <p>Error loading data: {error}</p>;

  const TableRow = ({ table, isExpanded, onClick }) => {
    
    return (
      <>
        <tr onClick={onClick} className="cursor-pointer bg-gray-100 hover:bg-gray-200">
          <td className="py-2 px-6">Table ID: {table.table_id} Table Number: {table.table_number}</td>
        </tr>
        
        {isExpanded && (
          <tr>
            <td colSpan="1" className="bg-gray-50">
              <div className="p-4 flex-auto">
                <p>Min Seats: {table.min_number_of_seats}</p>
                <p>Max Seats: {table.max_number_of_seats}</p>
                <p>Min Fund: {table.min_fund}</p>
                {/* {tables.map((table, index) => (
                <p
                  key={table.table_id}
                >

                </p> 
              ))}*/}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };
  
  const TableList = ({ tables }) => {
    const [expandedRow, setExpandedRow] = useState(null);
  
    const toggleRow = (index) => {
      setExpandedRow(expandedRow === index ? null : index);
    };
  
    return (
      <table className="w-3/5 mx-auto mb-4 table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Tables </th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table, index) => (
            <TableRow
              key={table.table_id}
              table={table}
              isExpanded={expandedRow === index}
              onClick={() => toggleRow(index)}
            />
          ))}
        </tbody>
      </table>
    );
  };

  
  
  return (
    <div className='flex-column text-center mx-auto min-h-screen'>
      <h1 className="text-lg font-bold">{restaurant.name}</h1>
      <p><strong>Address:</strong> {restaurant.address}</p>
      <p><strong>Description:</strong> {restaurant.description}</p>
      <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>
      <p><strong>Price per Seat:</strong> ${restaurant.price_per_seat}</p>
      <p><strong>Rating:</strong> {restaurant.rating}</p>
      <p><strong>Hours:</strong> {restaurant.hour_open} - {restaurant.hour_closed}</p>

      <Link to="/restaurant/createTable">
        <button 
          type="submit"
          className="w-100 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200 m-2"
        >
          Add New Table
        </button>
      </Link>

      {tables.length > 0 ? 
        <TableList tables={tables} /> 
      : (
        <p>No tables available.</p>
      )}

      <div className="w-4/5 mx-auto mt-6 mb-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Event ID</th>
              <th className="border border-gray-300 px-4 py-2">Table ID</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Time</th>
              <th className="border border-gray-300 px-4 py-2">Seats Confirmed</th>
              <th className="border border-gray-300 px-4 py-2">Seats Requested</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.event_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{event.event_id}</td>
                <td className="border border-gray-300 px-4 py-2">{event.table_id}</td>
                <td className="border border-gray-300 px-4 py-2">{event.event_date}</td>
                <td className="border border-gray-300 px-4 py-2">{event.event_time}</td>
                <td className="border border-gray-300 px-4 py-2">{event.number_of_seats_taken}</td>
                <td className="border border-gray-300 px-4 py-2">{event.number_of_seats_requested}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
      
      {events && tables && <ReservationTimeline reservations={events} tables={tables}/>}
      
    </div>
  );
};

export default RestaurantHomePage;

// Timeline Grid (Y-Axis as time, X-Axis as tables)
//       <div className="p-4">
//         {/* Time Slots (X-Axis) */}
//         <div className="grid grid-cols-9 gap-4">
//           <div></div> {/* Empty cell in the top left corner */}
//           {times.map((time) => (
//             <div key={time} className="font-bold text-center">
//               {time}
//             </div>
//           ))}
//         </div>

//         {/* Timeline Grid (Y-Axis as tables, X-Axis as times) */}
//         {tableNumbers.map((table) => (
//           <div key={table.table_id} className="grid grid-cols-9 gap-4 mt-2">
//             {/* Table Number (Y-Axis) */}
//             <div className="font-bold text-right pr-2">Table {table}</div>

//             {/* Reservations for each time at this table */}
//             {times.map((time) => {
//               const reservation = getReservationForTimeAndTable(time, table);
//               return (
//                 <div
//                   key={time}
//                   className={`h-16 flex items-center justify-center border rounded-lg ${
//                     reservation ? getStatusClasses(reservation.status) : "border-gray-300 bg-gray-100"
//                   }`}
//                 >
//                   {reservation ? (
//                     <div className="text-center">
//                       <p className="font-bold">{reservation.customer}</p>
//                       <p className="text-sm">
//                         Party of {reservation.partySize}
//                       </p>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500">No Reservation</p>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ))}
//       </div>
    

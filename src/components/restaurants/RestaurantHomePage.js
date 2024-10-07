import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

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
        await fetchEvents(restaurantData);
        console.log(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  
  const fetchEvents = async (restaurantData) => {
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

  const reservations = [
    { startTime: "12:00", endTime: "13:30", table: 1, customer: "John Doe", partySize: 4, status: "Confirmed" },
    { startTime: "13:00", endTime: "14:00", table: 2, customer: "Jane Smith", partySize: 2, status: "Pending" },
    { startTime: "14:00", endTime: "15:00", table: 3, customer: "Michael Lee", partySize: 3, status: "Confirmed" },
    { startTime: "15:00", endTime: "16:30", table: 1, customer: "Sarah Connor", partySize: 3, status: "Cancelled" },
    { startTime: "16:00", endTime: "17:30", table: 2, customer: "Alice Johnson", partySize: 5, status: "Confirmed" },
    { startTime: "12:30", endTime: "14:00", table: 4, customer: "David Clark", partySize: 2, status: "Pending" },
    { startTime: "13:30", endTime: "15:30", table: 5, customer: "Emma Wilson", partySize: 6, status: "Confirmed" },
    { startTime: "17:00", endTime: "18:00", table: 3, customer: "James Brown", partySize: 4, status: "Confirmed" },
    { startTime: "16:00", endTime: "18:00", table: 5, customer: "Linda Taylor", partySize: 3, status: "Cancelled" },
    { startTime: "12:00", endTime: "13:00", table: 2, customer: "Charlie Adams", partySize: 2, status: "Confirmed" },
  ];
  
  // Helper function to convert time (HH:MM) to a fractional hour (e.g., 13:30 -> 13.5)
  const timeToDecimal = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours + minutes / 60;
  };

  // Total range of the timeline (e.g., from 12:00 to 18:00 = 6 hours)
  const timelineStart = 12;
  const timelineEnd = 18;
  const timelineRange = timelineEnd - timelineStart;
    
  // Calculate the width and position based on the start and end time of the reservation
  const getReservationStyle = (startTime, endTime) => {
    const start = timeToDecimal(startTime);
    const end = timeToDecimal(endTime);
    const duration = end - start;
    return {
      left: `${((start - timelineStart) / timelineRange) * 100}%`, // Position based on start time relative to the total timeline
      width: `${(duration / timelineRange) * 100}%`, // Width based on the duration relative to the total timeline
    };
  };
  const times = ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];
  const tableNumbers = [1, 2, 3, 4, 5];

  const getStatusClasses = (status) => {
    switch (status) {
      case "Confirmed":
        return "border-green-500 bg-green-100 text-green-800";
      case "Pending":
        return "border-yellow-500 bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "border-red-500 bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const getReservationForTimeAndTable = (time, table) => {
    return reservations.find(
      (reservation) => reservation.time === time && reservation.table === table
    );
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

  const ReservationTimeline = () => {
    return (
      <div className="p-4">
        {/* Time labels at the top of the timeline */}
        <div className="flex justify-between mb-4 ml-16">
          {["12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time, index) => (
            <div key={index} className="font-bold">
              {time}
            </div>
          ))}
        </div>
        
        {/* Timeline Grid (Y-Axis as tables, continuous X-Axis as time) */}
        {Array.from({ length: 5 }, (_, i) => i + 1).map((table) => (
          <div key={table} className="relative mb-4">
            {/* Table Label */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 font-bold">
              Table {table}
            </div>
            
            {/* Time Axis */}
            <div className="flex items-center relative ml-16 h-16 border-t border-gray-300">
              {/* Display the reservation blocks for this table */}
              {reservations
                .filter((reservation) => reservation.table === table)
                .map((reservation, index) => (
                  <div
                    key={index}
                    className={`absolute h-10 flex items-center justify-center border rounded-lg ${getStatusClasses(reservation.status)}`}
                    style={getReservationStyle(reservation.startTime, reservation.endTime)}
                  >
                    <div className="text-center">
                      <p className="font-bold">{reservation.customer}</p>
                      <p className="text-sm">Party of {reservation.partySize}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
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
      
      <ReservationTimeline/>
      
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
    

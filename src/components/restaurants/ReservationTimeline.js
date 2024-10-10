import React, { useState, useEffect } from "react";

// Sample reservations data with start time, end time, date, and table
const reservations_1 = [
  { date: "2024-09-30", startTime: "10:00", endTime: "12:30", table: 1, customer: "John Doe", partySize: 4, status: "Confirmed" },
  { date: "2024-09-30", startTime: "13:00", endTime: "14:00", table: 2, customer: "Jane Smith", partySize: 2, status: "Pending" },
  { date: "2024-09-30", startTime: "14:00", endTime: "15:00", table: 3, customer: "Michael Lee", partySize: 3, status: "Confirmed" },
  { date: "2024-09-30", startTime: "15:00", endTime: "16:30", table: 1, customer: "Sarah Connor", partySize: 3, status: "Cancelled" },
  { date: "2024-09-30", startTime: "16:00", endTime: "17:30", table: 2, customer: "Alice Johnson", partySize: 5, status: "Confirmed" },
  { date: "2024-09-30", startTime: "12:30", endTime: "14:00", table: 4, customer: "David Clark", partySize: 2, status: "Pending" },
  { date: "2024-09-30", startTime: "13:30", endTime: "15:30", table: 5, customer: "Emma Wilson", partySize: 6, status: "Confirmed" },
  { date: "2024-10-01", startTime: "17:00", endTime: "18:00", table: 3, customer: "James Brown", partySize: 4, status: "Confirmed" },
  { date: "2024-09-30", startTime: "14:30", endTime: "16:00", table: 5, customer: "Linda Taylor", partySize: 3, status: "Cancelled" },
  { date: "2024-10-07", startTime: "14:00", endTime: "16:00", table: 5, customer: "Mark Jones", partySize: 4, status: "Cancelled" },
];

// Helper function to convert time (HH:MM) to a fractional hour (e.g., 13:30 -> 13.5)
const timeToDecimal = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

// Total range of the timeline (e.g., from 10:00 to 21:00 = 11 hours)
const timelineStart = 10;
const timelineEnd = 21;
const timelineRange = timelineEnd - timelineStart;

// Get today's date in the format YYYY-MM-DD
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month
  const day = String(today.getDate()).padStart(2, '0'); // Ensure two digits for day
  return `${year}-${month}-${day}`;
};

// Turn event_date_time timestamp into format YYYY-MM-DD
const extractDateFromTimestamp = (timestamp) => {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);
  // Extract the local date components
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = date.getDate().toString().padStart(2, '0');

  // Combine the components into YYYY-MM-DD format
  const localDate = `${year}-${month}-${day}`;

  // Extract the date in YYYY-MM-DD format
  // const formattedDate = date.toISOString().slice(0, 10);
  // console.log(formattedDate); // Output: "2024-08-11"
  return localDate;

};

const extractTimeFromTimestamp = (timestamp, isEnd) => {
  // Create a new Date object from the timestamp
  const date = new Date(timestamp);
  if (isEnd) {
    // Add 2 hours
    date.setHours(date.getHours() + 2);
  }
  // Extract hours and minutes
  let hours = date.getHours();    // Use getHours() if you want local time
  let minutes = date.getMinutes(); // Use getMinutes() if you want local time
  // Format hours and minutes to always be 2 digits
  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');
  // Combine hours and minutes into HH:MM format
  const time = `${hours}:${minutes}`;
  // console.log(time); // Output: "02:00"
  return time;

};

// Calculate the width and position based on the start and end time of the reservation
const getReservationStyle = (startTime, endTime) => {
  console.log(startTime, endTime);
  const start = timeToDecimal(startTime);
  const end = timeToDecimal(endTime);
  const duration = end - start;
  return {
    left: `${((start - timelineStart) / timelineRange) * 100}%`, // Position based on start time relative to the total timeline
    width: `${(duration / timelineRange) * 100}%`, // Width based on the duration relative to the total timeline
  };
};

const getStatusClasses = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 border-green-500";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-500";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-500";
    default:
      return "";
  }
};

const ReservationTimeline = ({reservations, tables}) => {
  const [selectedDate, setSelectedDate] = useState(getTodayDate()); // State for selected date
  const [filteredReservations, setFilteredReservations] = useState([]);
  console.log("Reservations - all tablesss:",reservations);
  // Filter reservations based on selected date
  

  useEffect(() => {
    setFilteredReservations(reservations.filter(
        (reservation) => extractDateFromTimestamp(reservation.event_date_time) === selectedDate
    ));
    
  }, [selectedDate]); 
  

  return (
    <div className="p-4">
      {/* Date Input and "Today" Button */}
      <div className="flex items-center mb-4">
        <label className="mr-2 font-bold">Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-1 rounded"
        />
        <button
          onClick={() => setSelectedDate(getTodayDate())}
          className="ml-4 bg-blue-500 text-white p-2 rounded"
        >
          Today
        </button>
      </div>

      {/* Scrollable area with sticky time labels */}
      <div className="relative h-[500px] overflow-y-auto">
        {/* Time labels at the top of the timeline (sticky) */}
        <div className="sticky top-0 bg-white z-10 ml-16 flex justify-between">
          {["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"].map(
            (time, index) => (
              <div key={index} className="font-bold">
                {time}
              </div>
            )
          )}
        </div>

      {/* Timeline Grid (Y-Axis as tables, continuous X-Axis as time) */}
      {tables.map((table) => (
        <div key={table.table_id} className="relative mb-4">
          {/* Table Label */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 font-bold">
            Table {table.table_number}
          </div>

           {/* Hour lines (faint vertical lines for each hour) */}
           <div className="absolute top-0 left-16 right-0 h-full border-gray-200 pointer-events-none">
            {Array.from({ length: timelineRange }, (_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-200"
                style={{
                  left: `${(i / timelineRange) * 100}%`, // Positioning the line for each hour
                }}
              />
            ))}
          </div>

          {/* Time Axis */}
          <div className="flex items-center relative ml-16 h-16 border-t border-gray-300">
            {/* Display the reservation blocks for this table */}
            {filteredReservations
              .filter((reservation) => reservation.table_id === table.table_id)
              .map((reservation) => (
                <div
                  key={reservation.event_id}
                  className={`absolute h-10 flex items-center justify-center border rounded-lg ${getStatusClasses(
                    "Pending" // change to actual status later
                  )}`}
                  style={getReservationStyle(
                    extractTimeFromTimestamp(reservation.event_date_time, false),
                    extractTimeFromTimestamp(reservation.event_date_time, true),
                  )}
                >
                  <div className="text-center">
                    <p className="font-bold">{reservation.host_user_id}</p>
                    <p className="text-sm">Party of {reservation.number_of_seats_requested}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ReservationTimeline;

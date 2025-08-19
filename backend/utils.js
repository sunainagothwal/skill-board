const formatDate=(timestamp)=>{
const date = new Date(timestamp); // Convert timestamp to Date object

// Formatting the date
const optionsDate = { 
  weekday: 'long',    // Full day name
  day: '2-digit',     // Day of the month
  month: 'short',     // Abbreviated month name
  year: 'numeric'     // Full year
};

const optionsTime = { 
  hour: '2-digit',    // 2-digit hour
  minute: '2-digit',  // 2-digit minute
  second: '2-digit',  // 2-digit second
  hour12: true        // 12-hour format with AM/PM
};

const formattedDate = date.toLocaleDateString('en-IN', { ...optionsDate, timeZone: 'Asia/Kolkata' });
const formattedTime = date.toLocaleTimeString('en-IN', { ...optionsTime, timeZone: 'Asia/Kolkata' });

const formattedTimestamp = `${formattedDate}, ${formattedTime}`;
 return formattedTimestamp;
//console.log(formattedTimestamp); // Example: "Tuesday, 21 Apr, 2025, 3:30:45 PM"

}
module.exports = { formatDate };
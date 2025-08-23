// utils/dateFormatter.js
/**
 * Format a UTC date string to local time with optional time display
 * @param {string} utcDateString - ISO date string in UTC
 * @param {boolean} includeTime - true to include time, false for date only
 * @returns {string} formatted date string
 */
export const formatUTCToLocal = (utcDateString, includeTime = true) => {
  if (!utcDateString) return "";

  const date = new Date(utcDateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && { hour: "numeric", minute: "numeric", hour12: true }),
  };

  return date.toLocaleString(undefined, options);
};

// dateApproximation.js

export const approximateDate = (timestamp) => {
    const diff = Date.now() - timestamp;
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
  
    if (seconds < 60) {
      return `${Math.floor(seconds)} seconds ago`;
    } else if (minutes < 60) {
      return `${Math.floor(minutes)} minutes ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)} hours ago`;
    } else if (days < 30) {
      return `${Math.floor(days)} days ago`;
    } else {
      // If it's over a month ago, return the exact date
      const date = new Date(timestamp);
      return date.toLocaleDateString();
    }
  };
  
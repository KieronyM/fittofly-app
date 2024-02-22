//This function calculates the hours and minutes remaining until midnight

export function calculateMinutesUntilMidnight(timestamp: number): { hours: number; minutes: number } {
    // Create a Date object from the timestamp
    const inputDate = new Date(timestamp);
  
    // Create a Date object representing the next midnight
    const midnight = new Date(inputDate);
    midnight.setHours(24, 0, 0, 0);
  
    // Calculate the time difference in milliseconds
    const timeDiffMilliseconds = midnight.getTime() - inputDate.getTime();
  
    // Convert milliseconds to hours and minutes
    const hours = Math.floor(timeDiffMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiffMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
    return { hours, minutes };
  }
  
  
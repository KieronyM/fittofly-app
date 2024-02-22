export function calculateTimeDifference(date1: Date, date2: Date): { hours: string; minutes: string } {
  const timeDifference = date2.getTime() - date1.getTime();
  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  let hoursString = hours.toString();
  let minutesString = minutes.toString();

  if (hoursString.length === 1) {
    hoursString = `0${hoursString}`;
  }

  if (minutesString.length === 1) {
    minutesString = `0${minutesString}`;
  }

  return { hours: hoursString, minutes: minutesString }
}


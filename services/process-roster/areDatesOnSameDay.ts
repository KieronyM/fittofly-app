

export function areDatesOnSameUTCDay(date1: Date, date2: Date): boolean {
  //console.log (" in function DATE1 year: ", date1.getFullYear(), " month: ", date1.getMonth() + 1 , " date: ", date1.getDate());
  //console.log (" in function DATE2 year: ", date2.getFullYear(), " month: ", date2.getMonth() + 1 , " date: ", date2.getDate());
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );

}

export function areDatesOnSameLocalDay(date1: Date, date2: Date): boolean {
  //console.log (" in function DATE1 year: ", date1.getFullYear(), " month: ", date1.getMonth() + 1 , " date: ", date1.getDate());
  //console.log (" in function DATE2 year: ", date2.getFullYear(), " month: ", date2.getMonth() + 1 , " date: ", date2.getDate());
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );

}



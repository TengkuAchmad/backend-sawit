exports.getLocalTime = (date) => {
   const utcOffset = 7; 
   const utcOffsetMs = utcOffset * 60 * 60 * 1000; 
   const localDate = date.getTime() + utcOffsetMs;
   return new Date(localDate)
}
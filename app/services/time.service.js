exports.getLocalTime = (date) => {
   const utcOffset = 7; 
   const utcOffsetMs = utcOffset * 60 * 60 * 1000; 
   const localDate = date.getTime() + utcOffsetMs;
   return new Date(localDate)
}

exports.parseTime = (dates) => {
   const date = new Date(dates);

   const formattedDate = date.getFullYear() +
      '-' + String(date.getMonth() + 1).padStart(2, '0') +
      '-' + String(date.getDate()).padStart(2, '0') +
      ' ' + String(date.getHours()).padStart(2, '0') +
      ':' + String(date.getMinutes()).padStart(2, '0') +
      ':' + String(date.getSeconds()).padStart(2, '0');


   return formattedDate;

}
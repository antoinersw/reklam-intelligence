const getDateTime = () => {
  const currentDate = new Date();

  // Get the current day, month, year, hours, minutes, and seconds
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // Note: January is 0!
  const year = currentDate.getFullYear();
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Format the date and time as needed
  const formattedDate =
    year +
    '-' +
    (month < 10 ? '0' + month : month) +
    (day < 10 ? '0' + day : day) +
    (hours < 10 ? '0' + hours : hours) +
    (minutes < 10 ? '0' + minutes : minutes) +
    (seconds < 10 ? '0' + seconds : seconds);

  // Output the formatted date and time
  return formattedDate;
};

export default getDateTime;

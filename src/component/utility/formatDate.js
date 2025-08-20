
exports.convertDateFormat=(wrongFormatDate)=> {
  // Parse the input date string
  const inputDate = new Date(wrongFormatDate);
  // Format the date to the correct format
  const options = {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  };
  const correctFormatDate = inputDate.toLocaleString("en-IN", options);
  return correctFormatDate;
}
export const formatDateWithMonthAbbr = (dateInput) => {
  const monthAbbrs = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let dateString;
  if (dateInput instanceof Date) {
    // Convert Date object to YYYY-MM-DD
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, "0");
    const day = String(dateInput.getDate()).padStart(2, "0");
    dateString = `${year}-${month}-${day}`;
  } else if (typeof dateInput === "string") {
    dateString = dateInput;
  } else {
    console.error("Invalid date input:", dateInput);
    // Fallback to current date or a default
    const fallbackDate = new Date();
    const year = fallbackDate.getFullYear();
    const month = String(fallbackDate.getMonth() + 1).padStart(2, "0");
    const day = String(fallbackDate.getDate()).padStart(2, "0");
    dateString = `${year}-${month}-${day}`;
  }

  try {
    const [year, month, day] = dateString.split("-");
    if (!year || !month || !day) {
      throw new Error("Invalid date format");
    }
    return `${year}-${monthAbbrs[parseInt(month) - 1]}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error, "Input:", dateString);
    // Fallback to a default formatted date
    const fallbackDate = new Date();
    const year = fallbackDate.getFullYear();
    const month = monthAbbrs[fallbackDate.getMonth()];
    const day = String(fallbackDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
};
export const formatDateToCustomTimeZone = (date, offset = "+0530") => {
  const options = {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  };
  const [weekday, day, month, year] = date
    .toLocaleDateString("en-US", options)
    .replace(/,/g, "")
    .split(" ");

  const timeOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  const formattedDateTime = `${weekday}, ${day} ${month} ${year} ${formattedTime} ${offset}`;
  return formattedDateTime;
};

"use client";
import { useState, useEffect } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const CommonDatePicker = ({ onDateChange, defaultDate = new Date() ,displayFormat,MAX_DATE=new Date(),MIN_DATE=new Date(2025, 0, 1)}) => {
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });
  
  console.log("defaultDate", defaultDate);

  // Set default date on mount or when defaultDate changes
  useEffect(() => {
    if (defaultDate && !isNaN(new Date(defaultDate).getTime())) {
      const isoDate = new Date(defaultDate).toISOString().split("T")[0];
      setDateValue({ startDate: isoDate, endDate: isoDate });
    } else {
      // Fallback to current date if defaultDate is invalid
      const today = new Date().toISOString().split("T")[0];
      setDateValue({ startDate: today, endDate: today });
    }
  }, []);

  const handleValueChange = (newValue) => {
    setDateValue(newValue);
    if (onDateChange && newValue?.startDate) {
      const selectedDate = new Date(newValue.startDate);
      if (!isNaN(selectedDate.getTime())) {
        onDateChange(selectedDate);
      }
    }
  };

  return (
    <>
      <Datepicker
        displayFormat={displayFormat || "DD/MM/YYYY"}
        useRange={false}
        asSingle={true}
        value={dateValue}
        onChange={handleValueChange}
        popoverDirection="up"
        primaryColor="rose"
        // inputClassName="opacity-0 absolute w-full h-full cursor-pointer"
        containerClassName="relative "
        classNames={{
          popover: "z-50",
        }}
         minDate={MIN_DATE}
            maxDate={MAX_DATE}
      />
    </>
  );
};

export default CommonDatePicker;

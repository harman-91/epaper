"use client";
import { useState, useEffect, useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { IoCalendarOutline } from "react-icons/io5";

import Styles from "../styles/Datepicker.module.css";

const CustomDatePicker = ({ onDateChange, defaultDate = new Date() ,maxDate,minDate}) => {
  const [dateValue, setDateValue] = useState({
    startDate: null,
    endDate: null,
  });
  const datepickerRef = useRef(null);
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
  const handleClick = () => {
    if (datepickerRef.current) {
      datepickerRef.current.focus(); // Use toggle method if supported by the library
    }
  };

  const renderToggleIcon = () => {
    // if (datepickerRef.current) {
    //   return <IoCalendarOutline />;
    // }
    return <IoCalendarOutline name="toggle calendar"  />;
  };

  return (
      
      <div
        className={`${Styles.datePicker} relative flex flex-col items-center gap-2 cursor-pointer w-[100px]`}
      >
        <Datepicker
          ref={datepickerRef}
          displayFormat="DD/MM/YYYY"
          useRange={false}
          asSingle={true}
          value={dateValue}
            inputName="datepicker"
          onChange={handleValueChange}
          popoverDirection="up"
          primaryColor="rose"
          // inputClassName="opacity-0 absolute w-full h-full cursor-pointer"
          containerClassName="relative flex flex-col-reverse justify-center items-center"
          // className=" flex flex-col items-center gap-2 cursor-pointer"
          toggleClassName="w-full flex justify-center items-center"
          classNames={{
            popover: "z-50",
            container: "flex flex-col",
          
          }}
          toggleIcon={renderToggleIcon}
          maxDate={maxDate}
          minDate={minDate}
        />
      </div>

  );
};

export default CustomDatePicker;

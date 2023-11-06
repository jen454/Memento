import React from "react";
import { useAppContext } from "../AppContext";
import Calendar from "react-calendar";
import "../Style/CustomCalendar.css";
import { useNavigate } from "react-router-dom";

const CustomCanlendar = () => {
  const { selectedDate, setSelectedDate } = useAppContext();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleDateChange = (date) => {
    setSelectedDate(date);
    navigate(`/DiaryOpen`); // 해당 날짜로 이동
  };

  return (
    <div>
      <Calendar
        locale="en"
        //onChange={onChange}
        onChange={handleDateChange} // handleDateChange 함수를 사용합니다.
        value={selectedDate}
        next2Label={null}
        prev2Label={null}
        showNeighboringMonth={false}
        calendarType="hebrew"
      />
    </div>
  );
};

export default CustomCanlendar;
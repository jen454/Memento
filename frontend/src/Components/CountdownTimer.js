import React, { useState, useEffect } from "react";
import "../Style/CountdownTimer.css";

const CountdownTimer = ({ targetDate }) => {
  const [time, setTime] = useState(targetDate - Date.now());

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime(targetDate - Date.now());
      }, 1000);

      return () => clearInterval(timer);
    } else {
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      nextDay.setHours(0, 0, 0, 0);
      setTime(nextDay - Date.now());
    }
  }, [time, targetDate]);

  const formatTime = (timeInMillis) => {
    const seconds = Math.floor((timeInMillis / 1000) % 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((timeInMillis / 1000 / 60) % 60)
      .toString()
      .padStart(2, "0");
    const hours = Math.floor(timeInMillis / 1000 / 3600)
      .toString()
      .padStart(2, "0");
    return `${hours}시 ${minutes}분 ${seconds}초`;
  };

  return (
    <div className="timer">
      <p>{formatTime(time)}</p>
    </div>
  );
};

export default CountdownTimer;
import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import "../Style/DiaryOpen.css";
import CountdownTimer from "../Components/CountdownTimer";
import indexSticker from "../image/index_sticker.png";
import home from "../image/home_icon.png";
import { Link, useNavigate } from "react-router-dom";

const DiaryOpen = () => {
  const { selectedDate } = useAppContext(); // 캘린더 날짜 연동
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = selectedDate.toLocaleDateString("ko-KR", options);

  const navigate = useNavigate();

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const nextDay = new Date(selectedDate);
  nextDay.setDate(nextDay.getDate() + 1);
  nextDay.setHours(0, 0, 0, 0);

  const ToRead = () => {
    console.log("이동");
    navigate("/ReadEntry");
  };

  useEffect(() => {
    // 시간에 따른 버튼 활성화 기능
    const interval = setInterval(() => {
      const currentTime = new Date();
      if (currentTime >= nextDay) {
        setIsButtonEnabled(false);
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [nextDay]);

  return (
    <div className="DiaryOpen-container">
      <div className="background-image">
        <img id="index" src={indexSticker} alt="index sticker" />
        <Link to={"/Main"}>
          <img id="home" src={home} alt="home button" />
        </Link>
        <div className="background-inner-image">
          <div className="select-date">
            {/* <img id="left" src={leftImage} alt="left Image" /> */}
            <h2>{formattedDate}</h2>
            {/* <img id="right" src={rightImage} alt="right Image" /> */}
          </div>
          <div className="timer-emoji">⏰</div>
          <CountdownTimer targetDate={nextDay} />
          <div className="timer-order">후에 일기를 볼 수 있어요!</div>
          <button onClick={ToRead} disabled={isButtonEnabled}>
            일기 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiaryOpen;
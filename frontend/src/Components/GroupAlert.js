import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import writelogo from '../image/write.png';
import { TitleContext } from '../Components/TitleContext';
import '../Style/GroupAlert.css';

const GroupAlert = () => {
  const navigate = useNavigate();

  // Get the current title from the context
  const { title } = useContext(TitleContext);

  const ToDiaryEntry = () => {
    navigate('/DiaryEntry');
  };

  return (
    <div className="GroupAlert-container">
      <h1 className="title">{title}</h1>
      <div className="write-image-btn">
        <button onClick={ToDiaryEntry}>
          <img src={writelogo} alt="../image/write.png" />
        </button>
      </div>
    </div>
  );
};

export default GroupAlert;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Style/GroupAdd.css';
import searchImage from '../image/search_logo.png';

const GroupAdd = () => {
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const navigate = useNavigate();

  const handleInputChange1 = (event) => {
    setInputValue1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInputValue2(event.target.value);
  };

  // GroupAdd.js에서 handleSaveClick 함수 수정
  const handleSaveClick = () => {
    if (inputValue1 !== '' && inputValue2 !== '') {
      // 입력값 저장
      setInputValue1('');
      setInputValue2('');
      navigate('/dashboard', {
        state: { inputValue1: inputValue1, inputValue2: inputValue2 },
      });
    } else {
      // Error 처리를 위한 코드
      alert('모든 입력란을 채워주세요');
    }
  };

  return (
    <div className="GroupAdd-container">
      <div className="background-image">
        <div className="background-inner-image">
          <div className="search">
            <div className="search-bar">
              <input type="text" placeholder="추가할 친구 검색"></input>
            </div>
            <div className="search-button">
              <button>
                <img src={searchImage} alt="search" />
              </button>
            </div>
          </div>
          <div className="main">
            교환일기 이름:
            <input
              id="name"
              type="text"
              value={inputValue1}
              onChange={handleInputChange1}
            />
            <div className="multiline-text"></div>
            추가된 친구들:
            <input
              id="friend"
              type="text"
              value={inputValue2}
              onChange={handleInputChange2}
            />
            <div className="multiline-text"></div>
            <button id="save-button" onClick={handleSaveClick}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAdd;
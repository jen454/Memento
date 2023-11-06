import React, { useState, useRef } from 'react';
import '../Style/ReadEntry.css';
import { Button } from 'react-bootstrap'; // npm install react-bootstrap bootstrap
import heart from '../image/heart.png';
import heart1 from '../image/heart1.png';
import heart2 from '../image/heart2.png';
import indexSticker from "../image/index_sticker.png";
import home from "../image/home_icon.png";
import { Link } from "react-router-dom";

function ReadEntry() {
  const [weather, setWeather] = useState('');
  const [title, setTitle] = useState('');
  const [feeling, setFeeling] = useState('');
  const [entry, setEntry] = useState('');
  const [grateful, setGrateful] = useState('');
  const [image, setImage] = useState(null);
  const [diary, setDiary] = useState(''); // 일기 입력란에 대한 상태를 정의합니다
  const [counter, setCounter] = useState(0);
  const [buttonImage, setButtonImage] = useState(heart);
  const [comments, setComments] = useState([]);
  const [commentListText, setCommentListText] = useState('');

  const handleButtonClick = () => {
    incrementCounter();

    // 버튼 이미지를 잠시 1번 이미지로 변경
    setButtonImage(heart1);

    // 주어진 시간(예시: 500ms) 후에 이미지를 2번 이미지로 변경
    setTimeout(() => {
      setButtonImage(heart2);
    }, 200);
  };

  const incrementCounter = () => {
    if (counter < 3) {
      setCounter(counter + 1);
    }
  };

  const toggleHeartImage = () => {
    if (buttonImage === heart) {
      setButtonImage(heart2);
    } else {
      setButtonImage(heart);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 작성한 내용을 저장하는 코드를 작성하세요.
  };
  /* 댓글기능 */

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Enter 키에 의한 줄바꿈 방지
      addComment();
    }
  }

  function addComment() {
    const commentInput = document.getElementById('write-comment');
    const newComment = commentInput.value;

    if (newComment) {
      setComments([...comments, newComment]);
      setCommentListText(
        (prevCommentListText) =>
          `${prevCommentListText}익명${comments.length + 1} : ${newComment}\n`
      );
      commentInput.value = '';
    }
  }

  return (
    <div className="ReadEntry-container">
      <div className="RE-background-image">
        <img id="index" src={indexSticker} alt="index sticker" />
        <Link to={"/Main"}>
          <img id="home" src={home} alt="home button" />
        </Link>
        <div className="RE-main-layout">
          <div
            className="header-text"
            style={{ position: 'absolute', top: '60px' }}
          >
            2023년 8월 14일 현진이의 일기
          </div>
          <div className="RE-left-content">
            <form onSubmit={handleSubmit}>
              <div className="custom-input-wrapper">
                <span className="fixed-text">제목:</span>
                <input
                  className="custom-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <div className="underline" />
              </div>
              <div className="form-group-inline">
                <div className="custom-input-wrapper">
                  <span className="fixed-text">날씨:</span>
                  <input
                    className="custom-input"
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                  />
                  <div className="underline weather-underline" />
                </div>
                <div className="custom-input-wrapper feeling-input">
                  <span className="fixed-text">기분:</span>
                  <input
                    className="custom-input"
                    value={feeling}
                    onChange={(e) => setFeeling(e.target.value)}
                  />
                  <div className="underline feeling-underline" />
                </div>
              </div>
              <textarea
                placeholder="일기가 쓰여 있겠죵"
                className="custom-textarea"
                value={diary}
                onChange={(e) => setDiary(e.target.value)}
              />
            </form>
          </div>
          <div className="vertical-line"></div>
          <div className="RE-right-content">
            <div className="button-and-text">
              <button
                class="button1"
                onClick={handleButtonClick}
                style={{
                  backgroundImage: `url(${buttonImage})`,
                }}
              ></button>
              <div className="custom-counter-text">
                {counter} 명이 좋아합니다.
              </div>
            </div>
            <hr className="horizontal-line" />
            <textarea
              id="comment-list"
              readOnly
              value={commentListText}
              style={{ fontSize: '25px', fontWeight: 'bold' }}
            />
            <div className="comment-write-row">
              <textarea id="write-comment" onKeyPress={handleKeyPress} />
              <button onClick={addComment} className="new-button">
                입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadEntry;

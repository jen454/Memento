import React, { useState, useRef } from "react";
import "../Style/DiaryEntry.css";
import indexSticker from "../image/index_sticker.png";
import home from "../image/home_icon.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

function DiaryEntry() {
  const [weather, setWeather] = useState("");
  const [title, setTitle] = useState("");
  const [feeling, setFeeling] = useState("");
  const [entry, setEntry] = useState("");
  const [grateful, setGrateful] = useState("");
  const [image, setImage] = useState(null);
  const [diary, setDiary] = useState(""); // 일기 입력란에 대한 상태를 정의합니다
  const saveImageBtnRef = useRef(null);
  const [question, setQuestion] = useState("랜덤질문");
  const [cookies, setCookies] = useCookies(["x_auth"]);
  const questions = [
    "오늘 하루 감사한 일",
    "살아온 날 중에 좋았던 일",
    "오늘 가장 기억에 남는 순간",
    "오늘 경험한 행복했던 순간",
    "오늘 가장 맛있게 먹은 음식",
    "오늘 느꼈던 가장 큰 성취감",
    "오늘 하루 감동적인 사람",
  ];

  function getRandomQuestion(currentQuestion) {
    let randomIndex;

    do {
      randomIndex = Math.floor(Math.random() * questions.length);
    } while (questions[randomIndex] === currentQuestion);

    return questions[randomIndex];
  }

  const handleChangeQuestion = () => {
    setQuestion(getRandomQuestion(question));
  };

  const handleBtnClick = () => {
    // 이미지를 클릭할 때마다 애니메이션을 실행합니다.
    const saveImageBtn = saveImageBtnRef.current;
    if (saveImageBtn) {
      saveImageBtn.style.animation = "rotate 1s linear";
      setTimeout(() => {
        saveImageBtn.style.animation = "";
      }, 1000);
    }
    console.log("Diary saved."); // 확인용 코드입니다. 이를 실행할 때마다 콘솔 창에 "Diary saved."가 출력됩니다.
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const diaryData = {
      title,
      weather,
      feeling,
      content: diary,
      // 추가적으로 필요한 정보들...
    };

    try {
      // POST 요청으로 일기 데이터 전송
      //   const response = await axios.post("routes/api/diary", diaryData);
      const response = await axios.post(
        "http://localhost:5001/api/diary",
        diaryData,
        {
          headers: {
            x_auth: cookies.x_auth,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        alert("일기가 성공적으로 저장되었습니다.");
        setDiary(""); // 입력란 초기화
        setTitle("");
        setWeather("");
        setFeeling("");
        // ...
      } else {
        alert("일기 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류로 인해 일기 저장에 실패했습니다.");
    }
  };

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="DiaryEntry-container">
      <div className="background-image">
        <img id="index" src={indexSticker} alt="index sticker" />
        <Link to={"/Main"}>
          <img id="home" src={home} alt="home button" />
        </Link>
        <div className="DE-main-layout">
          <div className="DE-left-content">
            <h1>오늘의 일기</h1>
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
                placeholder="네잎클로버를 누르면 저장할 수 있어요!"
                className="custom-textarea"
                value={diary}
                onChange={(e) => setDiary(e.target.value)}
              />
            </form>
          </div>
          <div className="DE-right-content">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="submit-button-container">
                  <button
                    type="save"
                    className="save-image-btn"
                    onClick={handleBtnClick}
                    ref={saveImageBtnRef}
                  ></button>
                </div>
              </div>
            </form>
            <p className="random-question">{question}</p>
            <div className="custom-input-wrapper">
              <input
                type="text"
                className="memo_custom-input"
                placeholder="답변을 입력해 주세요."
              />
              <div className="memo_underline" />
            </div>
            <div className="buttons-row">
              {/* Add the Change Question button in a new buttons-row */}
              <button
                className="change-question-btn"
                onClick={handleChangeQuestion}
              >
                질문 바꾸기
              </button>
              {/* <label htmlFor="file-upload" className="custom-file-upload">
                                사진 넣기
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            /> */}
            </div>

            <div className="form-group">
              <br />
              {image && (
                <div className="form-group">
                  <br />
                  <img
                    src={image}
                    alt="Preview"
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiaryEntry;

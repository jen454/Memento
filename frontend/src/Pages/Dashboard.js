// Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import '../Style/Dashboard.css';
import buttonImage from '../image/add_bt.png';
import indexSticker from '../image/index_sticker.png';
import { TitleContext } from '../Components/TitleContext';
import home from '../image/home_icon.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { setTitle } = useContext(TitleContext);

  const navigate = useNavigate();

  const handleSquareClick = (title) => {
    setTitle(title); // Set the title in the global state.
    navigate('/Main');
  };

  const location = useLocation();
  const { inputValue1, inputValue2 } = location.state || {};

  const initialDiaries = JSON.parse(localStorage.getItem('diaries')) || [
    { 제목: '', 그룹원: '' },
    { 제목: '일기1', 그룹원: '그룹' },
  ];

  const [searchResults, setSearchResults] = useState(initialDiaries);

  const [mainTitle, setMainTitle] = useState('');

  useEffect(() => {
    if (inputValue1 && inputValue2) {
      // Check if the limit has been reached
      if (searchResults.length >= 10) {
        // Including the "그룹 추가" button, so it's 10.
        alert("You can't add more than 9 diaries.");
        return;
      }

      // Add new diary to the list and save it to local storage
      const newDiaries = [
        ...searchResults,
        { 제목: inputValue1, 그룹원: inputValue2 },
      ];

      setSearchResults(newDiaries);
      localStorage.setItem('diaries', JSON.stringify(newDiaries));
    }
  }, [inputValue1, inputValue2]);

  const searchDiaries = (query) => {
    if (query === '') {
      setSearchResults([
        { 제목: '일기1', 그룹원: '그룹' },
        //...
      ]);
    } else {
      const filteredResults = searchResults.filter(
        (diary) =>
          diary.제목.toLowerCase().includes(query.toLowerCase()) ||
          diary.그룹원.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredResults);
    }
  };

  const displayResult = (diary) => {
    return `${diary.제목} - ${diary.그룹원}`;
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchDiaries(inputValue);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-background-image">
        <img id="index" src={indexSticker} alt="index sticker" />
        <Link to={'/Main'}>
          <img id="home" src={home} alt="home button" />
        </Link>
        <div className="main-layout">
          <div className="rounded-input-container">
            <input
              className="rounded-input"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="일기 그룹 검색"
            />
          </div>{' '}
          <div className="grid-container">
            {searchResults.map((result, i) => (
              <div
                className={`square${i > 0 ? ` square-${i}` : ''}`}
                key={i}
                onClick={() => i > 0 && handleSquareClick(result.제목)}
              >
                {i === 0 && (
                  <div>
                    <Link to={'/GroupAdd'}>
                      <button className="transparent-button">
                        <img src={buttonImage} alt="버튼 이미지" />
                      </button>
                    </Link>
                    <p className="button-text">그룹 추가</p>
                  </div>
                )}
                {i > 0 && <div className="tag">{displayResult(result)}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/Friends.css";
import searchImage from "../image/search_logo.png";
import { useCookies } from "react-cookie";

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [friendslist, setFriendslist] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [cookies, setCookies] = useCookies(["x_auth"]);
  const navigate = useNavigate();

  // Friends 컴포넌트에서의 친구 추가 버튼 클릭 시
  const addFriend = (name) => {
    axios
      .post(
        "http://localhost:5001/api/add_friend_request",
        { friendName: name },
        { withCredentials: true } // 쿠키를 전송하기 위한 옵션
      )
      .then((response) => {
        alert(response.data.message); // 서버에서 보낸 메시지 출력
        // 친구 요청 성공 시 원하는 처리를 수행
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 모든 사용자 정보 가져오기
  function getUsers() {
    axios
      .get("http://localhost:5001/api/all_users")
      .then((response) => {
        console.log(response.data); // 서버 응답 데이터 출력
        setFriends(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // 사용자의 친구 리스트
  const getMyFriendList = () => {
    axios
      .get("http://localhost:5001/api/my_friend_list_show", {
        withCredentials: true,
        headers: {
          x_auth: cookies.x_auth,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFriendslist(response.data.my_friend_list);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getMyFriendList();
  }, []);

  const handleSearchInputChange = (event) => {
    const keyword = event.target.value;
    setSearchKeyword(keyword);

    if (keyword.trim() === "") {
      setIsSearching(false);
      // getMyFriendList();
    } else {
      setIsSearching(true);
      getUsers();
    }
  };

  const MainToGroup = () => {
    navigate("/Dashboard");
  };

  return (
    <div className="top-container">
      <div className="search-container">
        <div className="search-bar-container">
          <input
            type="text"
            value={searchKeyword}
            onChange={handleSearchInputChange}
            placeholder="친구 검색"
          />
        </div>
        <div className="search-button-container">
          <button>
            <img src={searchImage} alt="search"></img>
          </button>
        </div>
      </div>
      <div className="friends-list-container">
        <div className="friends-container">
          {isSearching ? (
            <ul className="search-results">
              {friends
                .filter((friend) =>
                  friend.name
                    .toLowerCase()
                    .includes(searchKeyword.toLowerCase())
                )
                .map((friend, index) => (
                  <li key={index} className="search-result-item">
                    <span>{friend.name}</span>
                    <button onClick={() => addFriend(friend.name)}>
                      친구 추가
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            // 친구 목록을 보여주는 부분을 추가
            <ul className="friends-list">
              {friendslist?.length &&
                friendslist.map((friend, index) => (
                  <li key={index} className="friend-item">
                    <span>{friend.name}</span>
                    <button>친구 삭제</button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
      <div className="togroup-container">
        <button onClick={MainToGroup}>그룹</button>
      </div>
    </div>
  );
};

export default Friends;

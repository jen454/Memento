import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Style/Profile.css";
import alarmImg from "../image/alarm_logo.png";
import Modal from "react-modal";
import { useCookies } from "react-cookie";

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [cookies, setCookies] = useCookies(["x_auth"]);

  useEffect(() => {
    // 사용자 정보를 가져오는 요청
    axios
      .get("http://localhost:5001/api/userinfo", {
        withCredentials: true,
        headers: {
          x_auth: cookies.x_auth,
        },
      })
      .then((response) => {
        if (response.data.name) {
          setUserName(response.data.name);
        }
      })
      .catch((error) => {
        console.error("사용자 정보 요청 중 오류:", error);
      });
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = () => {
    console.log("실행");
    axios
      .get("http://localhost:5001/api/logout", { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          console.log(response);
          alert("로그아웃 하였습니다.");
          navigate("/");
        } else {
          console.log(response.data);
          alert("로그아웃에 실패했습니다");
        }
      })
      .catch((error) => {
        console.error("로그아웃 요청 중 오류:", error);
      });
  };

  const fetchNotifications = () => {
    // 알림 목록을 가져오는 요청
    axios
      .get("http://localhost:5001/api/notifications", {
        withCredentials: true,
        headers: {
          x_auth: cookies.x_auth,
        },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
      })
      .catch((error) => {
        console.error("알림 목록 요청 중 오류:", error);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Profile 컴포넌트에서의 알림 목록 내 친구 요청 수락 버튼 클릭 시
  const handleAccept = (index) => {
    const notification = notifications[index];
    console.log(notification.sender);
    axios
      .post(
        "http://localhost:5001/api/accept_friend_request",
        { sender: notification.sender },
        {
          withCredentials: true,
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        alert(response.data);
        // 알림 수락 처리 후 해당 알림을 제거
        const updatedNotifications = notifications.filter(
          (_, i) => i !== index
        );
        setNotifications(updatedNotifications);
        alert("친구 요청을 수락 하였습니다.");
        // 알림 요청 알림 추가
        // addNotification(senderName);
        // 서버에서 알림 목록 다시 가져오기
        fetchNotifications();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleReject = (index) => {
    const notification = notifications[index];
    axios
      .post(
        "http://localhost:5001/api/reject_friend_request",
        { sender: notification.sender },
        {
          withCredentials: true,
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        // 알림 거절 처리 후 해당 알림을 제거
        const updatedNotifications = notifications.filter(
          (_, i) => i !== index
        );
        setNotifications(updatedNotifications);
        // 알림 거절 시 알림 목록 다시 가져오기
        fetchNotifications();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="Profile-container">
      <div className="Profile-content">
        <div className="user-info">
          <span>{userName}</span>
          <button className="alarm-button" onClick={() => setModalIsOpen(true)}>
            <img id="alarm" src={alarmImg} alt="alarmImage" />
          </button>
        </div>
        <div className="divider"></div>
        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            로그아웃
          </button>
        </div>
        <Modal
          className="alarm-list"
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
        >
          <div className="notification-container">
            {notifications?.length &&
              notifications.map((notification, index) => (
                <div key={index} className="notification">
                  {notification.message}
                  <div className="buttons">
                    <button
                      className="accept-button"
                      onClick={
                        () => handleAccept(index) // 이후에 수정해야하는 부분(데이터베이스에 추가되도록)
                      }
                    >
                      수락
                    </button>
                    <button
                      className="refuse-button"
                      onClick={
                        () => handleReject(index) // 이후에 수정해야하는 부분
                      }
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Profile;

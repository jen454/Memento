// Login.js
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from "../actions/user_action";
import "../Style/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 상태 변수를 사용하여 사용자명과 비밀번호를 관리합니다.
  const [id, setUserId] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 버튼을 눌렀을 때 실행되는 함수입니다.
  const handleLogin = (e) => {
    e.preventDefault();
    if (!id) {
      return alert("ID를 입력하세요.");
    } else if (!password) {
      return alert("Password를 입력하세요.");
    } else {
      let body = {
        id,
        password,
      };

      dispatch(loginUser(body)).then((response) => {
        if (response.payload.loginSuccess) {
          console.log("로그인 성공");
          navigate("/Main");
        } else {
          alert("로그인 실패");
        }
      }).catch((error) => {
        console.error("로그인 요청 중 오류:", error);
      });
    }
  };

  const LoginToSignUp = () => {
    navigate('/SignUp');
  }

  return (
    <div className="signin-container">
      <div className="background-image">
        <div className="signin-box">
          <h2>SIGN IN</h2>
          <div className="id-box">
            <input
              type="text"
              value={id}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="ID*"
            />
          </div>
          <div className="password-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password*"
            />
          </div>
          <button onClick={handleLogin}>SIGN IN</button>
        </div>
        <div className="signup-link">
          아직 회원이 아니신가요?
          <a href="#" onClick={LoginToSignUp}>회원가입</a>
        </div>
        <div className="division-line"></div>
        <div className="kakao-login">
          <button>카카오톡 계정으로 로그인</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
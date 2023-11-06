import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Style/SignUp.css";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      return alert("ID를 입력하세요.");
    } else if (!password) {
      return alert("Password를 입력하세요.");
    } else if (!email) {
      return alert("email을 입력하세요.");
    } else if (!name) {
      return alert("name을 입력하세요.");
    }

    let body = {
      name,
      email,
      id,
      password,
    }

    try {
      const response = await axios.post("http://localhost:5001/api/register", body);

      if (response.data === "Success") {
        console.log("회원가입 성공");
        // 로그인 처리 등 다른 작업 수행
        // dispatch(loginUser(userInfo)); // 로그인 상태 관리 등
        navigate("/");
      } else {
        console.log("회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류:", error);
    }
  };

  const SignUpToLogin = () => {
    navigate("/");
  };

  return (
    <div className="signup-container">
      <div className="background-image">
        <div className="signup-box">
          <h1>회원가입</h1>
          <form onSubmit={handleSubmit} className="signup-form">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                placeholder="Name *"
              />
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Email *"
              />
            </div>
            <div>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="input-field"
                placeholder="ID *"
              />
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Password *"
              />
            </div>
            <button
              type="submit"
              className="signup-image-btn"
              onClick={handleSubmit}
            ></button>
          </form>
          <p className="login-link">
            이미 회원이신가요?
            <a href="#" onClick={SignUpToLogin}>
              로그인하기
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
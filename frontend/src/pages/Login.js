import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Popup from "reactjs-popup";

import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

import RegisterPopup from "../components/RegisterUserPopup.js";

import "./Login.css";

export default function Login() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const { setAuth, persist, setPersist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";

  const loginClicked = async () => {
    try {
      const response = await axios.post(
        "/login",
        {
          mail: mail,
          password: password,
        },
        {
          headers: { ContentType: "application/json" },
          withCredentials: true,
        }
      );
      const token = response?.data?.token;
      const userid = response?.data?.userid;

      setAuth({ userid, token });
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrorMsg("No response from server");
      } else if (err.response?.status === 400) {
        setErrorMsg("Missing email or password");
      } else if (err.response?.status === 401) {
        setErrorMsg("Unauthorized");
      } else {
        setErrorMsg("Login Failed");
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      loginClicked().then((r) => {});
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="loginWrapper">
      <div className="login">
        <div className="loginForm">
          <h2 className="modalLabel">Login</h2>
          <h4 className="modalLabel">E-mail</h4>
          <input
            className="modalInput"
            type="email"
            value={mail}
            placeholder="E-mail"
            onChange={(e) => {
              setMail(e.target.value);
            }}
          />

          <h4 className="modalLabel">Password</h4>
          <input
            className="modalInput"
            type="password"
            value={password}
            placeholder="Password"
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="submitLoginContainer">
            <div className="trustDevice">
              <input
                className="loginCheckbox"
                type="checkbox"
                id="persist"
                onChange={togglePersist}
                checked={persist}
              />
              <label className="modalLabel" htmlFor="persist">
                Trust This Device?
              </label>
            </div>
            <div className="loginRegisterButtons">
              <Popup
                modal={true}
                className="modalPopup"
                position="center center"
                trigger={
                  <button type="button" className="registerButton">
                    Register
                  </button>
                }
              >
                {(close) => {
                  return <RegisterPopup close={close} />;
                }}
              </Popup>
              <button
                type="submit"
                className="loginButton"
                onClick={loginClicked}
              >
                Log in
              </button>
            </div>
          </div>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
        </div>
      </div>
    </div>
  );
}

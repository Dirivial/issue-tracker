import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

import RegisterPopup from "../components/RegisterUserPopup.js";

import "./Login.css";

export default function Login() {
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  return (
    <div className="login">
      <LoginForm />
      <div className="btnLoginRow">
        <button className="btnLogin" onClick={() => setShowRegisterPopup(true)}>
          Not registered?
        </button>
      </div>

      <RegisterPopup
        show={showRegisterPopup}
        onHide={() => {
          setShowRegisterPopup(false);
        }}
      />
    </div>
  );
}

function LoginForm() {
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
    <div className="loginform-thing">
      <div className="loginFormWrapper" style={{ maxWidth: 750 }}>
        <form style={{ maxWidth: 700 }} className="">
          <div className="loginInput" controlId="formBasicEmail">
            <div className="float-left">E-mail</div>
            <input
              type="email"
              value={mail}
              placeholder="E-mail"
              onChange={(e) => {
                setMail(e.target.value);
              }}
            />
          </div>

          <div className="loginInput" controlId="formBasicPassword">
            <div className="float-left">Password</div>
            <input
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
          </div>
          <div className="submitLoginContainer">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist"> Trust This Device? </label>
            <button className="btnLogin" onClick={loginClicked}>
              Log in
            </button>
          </div>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
        </form>
      </div>
    </div>
  );
}

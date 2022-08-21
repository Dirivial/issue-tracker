import React, { useState } from "react";

import axios from "../api/axios.js";

export default function RegisterUserPopup(props) {
  const [mail, setMail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  function handleKeyDown(event) {}

  async function submitInformation() {
    try {
      await axios.post(
        "/register",
        {
          mail,
          username,
          password,
        },
        {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        }
      );
      props.onHide();
    } catch (err) {
      if (!err?.response) {
        setErrorMsg("No server response.");
      } else if (err.response?.status === 409) {
        setErrorMsg("The given Email is already in use.");
      } else {
        setErrorMsg("Registration failed");
      }
    }
  }

  return (
    <div className="NewIssuePopup">
      <div>
        <div>
          <div id="contained-modal-title-vcenter">Register</div>
        </div>
        <div>
          <form style={{ maxWidth: 700 }} className="">
            <div className="loginInput">
              <div className="float-left">Email</div>
              <input
                type="email"
                value={mail}
                placeholder="Enter email"
                onChange={(e) => {
                  setMail(e.target.value);
                }}
              />
            </div>
            <div className="loginInput">
              <div className="float-left">Username</div>
              <input
                type="user"
                value={username}
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>

            <div className="loginInput">
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
          </form>
        </div>
        <div>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <button className="float-left" onClick={props.onHide}>
            Close
          </button>
          <button onClick={submitInformation}>Submit</button>
        </div>
      </div>
    </div>
  );
}

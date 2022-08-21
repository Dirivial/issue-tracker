import React, { useState } from "react";

import Modal from "./Modal.js";
import axios from "../api/axios.js";

export default function RegisterUserPopup({ close }) {
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
      close();
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
    <Modal
      header="Register"
      submitText="Register"
      closeText="Close"
      onSubmit={submitInformation}
      onClose={close}
      render={() => {
        return (
          <div className="modalBody">
            <div className="modalBodyGroup">
              <div className="modalLabel">Email</div>
              <input
                className="modalInput"
                type="email"
                value={mail}
                placeholder="Enter email"
                onChange={(e) => {
                  setMail(e.target.value);
                }}
              />
            </div>
            <div className="modalBodyGroup">
              <div className="modalLabel">Username</div>
              <input
                className="modalInput"
                type="text"
                value={username}
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>

            <div className="modalBodyGroup">
              <div className="modalLabel">Password</div>
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
            </div>
            {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          </div>
        );
      }}
    />
  );
}

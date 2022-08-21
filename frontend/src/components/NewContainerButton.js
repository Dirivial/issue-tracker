import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Popup from "reactjs-popup";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useAuth from "../hooks/useAuth.js";

import "./NewContainerButton.css";

export default function NewContainerButton(props) {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  async function submitContainer(close) {
    try {
      const response = axiosPrivate.post(
        "/container/create",
        {
          name: name,
          position: props.position(),
          userid: auth.userid,
        },
        {
          "Content-type": "application/json; charset=UTF-8",
        }
      );
      setName("");
      props.updateContainers();
      close();
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  }

  return (
    <div className="NewContainerComponent">
      <Popup
        trigger={
          <button
            className="NewContainerBtn"
            onClick={() => setShowModal(true)}
          >
            New Container
          </button>
        }
        position="center center"
        modal={true}
        className="new-container"
      >
        {(close) => {
          return (
            <div className="newContainerPopup">
              <h2 className="newContainerHeader">Create New Container</h2>
              <div className="newContainerBody">
                <h3 className="newContainerLabel">Name:</h3>
                <input
                  className="newContainerInput"
                  autoComplete="off"
                  type="text"
                  value={name}
                  placeholder="Enter a name"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="newContainerFooter">
                {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
                <button className="closeButton" onClick={close}>
                  Close
                </button>
                <button
                  className="saveButton"
                  onClick={() => submitContainer(close)}
                >
                  Create
                </button>
              </div>
            </div>
          );
        }}
      </Popup>
    </div>
  );
}

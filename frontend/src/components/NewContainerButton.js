import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Popup from "reactjs-popup";

import Modal from "./Modal.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useAuth from "../hooks/useAuth.js";

import "./NewContainerButton.css";

export default function NewContainerButton({ position, updateContainers }) {
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
          position: position(),
          userid: auth.userid,
        },
        {
          "Content-type": "application/json; charset=UTF-8",
        }
      );
      setName("");
      updateContainers();
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
          <button className="NewContainerBtn" onClick={null}>
            New Container
          </button>
        }
        position="center center"
        modal={true}
        className="modalPopup"
      >
        {(close) => {
          return (
            <Modal
              header={"Create New Container"}
              closeText="Close"
              submitText="Submit"
              onClose={close}
              onSubmit={() => submitContainer(close)}
              render={() => {
                return (
                  <div className="modalBody">
                    {" "}
                    <h3 className="modalLabel">Name:</h3>
                    <input
                      className="modalInput"
                      autoComplete="off"
                      type="text"
                      value={name}
                      placeholder="Enter a name"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    {errorMsg ? (
                      <p style={{ color: "red" }}>{errorMsg}</p>
                    ) : null}
                  </div>
                );
              }}
            />
          );
        }}
      </Popup>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useAuth from "../hooks/useAuth.js";

import "./NewContainerButton.css";

export default function NewContainerButton(props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="NewContainerComponent">
      <button className="NewContainerBtn" onClick={() => setShowModal(true)}>
        New Container
      </button>

      <NewContainerPopup
        updateContainers={() => props.new()}
        onHide={() => setShowModal(false)}
        show={showModal}
        position={props.position}
      />
    </div>
  );
}

function NewContainerPopup(props) {
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  async function submitContainer() {
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
      props.onHide();
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  }

  return (
    <div className="NewContainerButton">
      <div
        show={props.show}
        onHide={props.onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <div closeButton>
          <div id="contained-modal-title-vcenter">Create New Container</div>
        </div>
        <div>
          <div className="" controlId="containerName">
            <div className="float-left">Name of container</div>
            <input
              autoComplete="off"
              type="text"
              value={name}
              placeholder="Enter a name"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <div>
          {errorMsg ? <p style={{ color: "red" }}>{errorMsg}</p> : null}
          <button className="float-left" onClick={props.onHide}>
            Close
          </button>
          <button onClick={() => submitContainer()}>Create</button>
        </div>
      </div>
    </div>
  );
}

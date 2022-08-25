import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useAuth from "../hooks/useAuth.js";
import ListViewer from "../components/ListViewer.js";
import "./Container.css";

export default function Container() {
  const [name, setName] = useState("");
  const [allowUpdate, setAllowUpdate] = useState(false);
  const { auth } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const sendContainerUpdate = async () => {
    if (!allowUpdate) return;
    try {
      await axiosPrivate.post("/container/update", {
        name: name,
        id: id,
      });
      setAllowUpdate(false);
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  const deleteContainer = async () => {
    try {
      await axiosPrivate.post("/container/remove", {
        containerid: id,
        userid: auth.userid,
      });

      navigate("/containers", { state: { from: null }, replace: true });
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    setAllowUpdate(true);
  }, [name]);

  useEffect(() => {
    const getContainerInfo = async () => {
      try {
        const response = await axiosPrivate.get("/container/get?id=" + id);
        setName(response?.data?.name);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getContainerInfo();
  }, [axiosPrivate, navigate, id, location]);

  return (
    <div className="userContainer">
      <div className="containerHeader">
        <input
          className="containerTitle"
          onBlur={sendContainerUpdate}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <button className="deleteContainer" onClick={deleteContainer}>
          Delete Container
        </button>
      </div>
      <ListViewer containerid={id} />
    </div>
  );
}

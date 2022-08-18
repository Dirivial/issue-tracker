import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import ListViewer from "../components/ListViewer.js";
import "./Container.css";

export default function Container() {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [allowUpdate, setAllowUpdate] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPrivate = useAxiosPrivate();

  const sendContainerUpdate = async () => {
    if (!allowUpdate) return;
    try {
      await axiosPrivate.post("/container/update", {
        name: name,
        description: desc,
        id: id,
        position: data.position,
      });
      setAllowUpdate(false);
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    setAllowUpdate(true);
  }, [name, desc]);

  useEffect(() => {
    const getContainerInfo = async () => {
      try {
        const response = await axiosPrivate.get("/container/get?id=" + id);
        setData(response?.data);
        setName(response?.data?.name);
        setDesc(response?.data?.description);
      } catch (err) {
        console.log(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getContainerInfo();
  }, [axiosPrivate, navigate, id, location]);

  return (
    <div className="user-container">
      <div className="container-header">
        <input
          className="container-title"
          onBlur={sendContainerUpdate}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        {/* <textarea className="container-description" value={desc} onBlur={sendContainerUpdate} onChange={(e) => {setDesc(e.target.value)}}/> */}
      </div>
      <ListViewer containerid={id} />
    </div>
  );
}

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useAuth from "../hooks/useAuth.js";
import NewContainerButton from "../components/NewContainerButton.js";
import ContainerListItem from "../components/ContainerListItem.js";

import "./ContainerList.css";

export default function ContainerList() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [containerData, setContainerData] = useState({});
  const axiosPrivate = useAxiosPrivate();

  const getContainersCallback = useCallback(() => {
    const getContainers = async () => {
      try {
        const response = await axiosPrivate.get("/container/my-containers", {
          withCredentials: true,
        });
        let data = response?.data?.containers;
        data.sort((first, second) =>
          first.position < second.position ? -1 : 1
        );
        setContainerData(data);
      } catch (err) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getContainers();
  }, [axiosPrivate, navigate, location]);

  const deleteContainer = async (containerid) => {
    try {
      await axiosPrivate.post("/container/remove", {
        containerid: containerid,
        userid: auth.userid,
      });
      getContainersCallback();
    } catch (err) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  };

  useEffect(() => {
    getContainersCallback();
  }, [getContainersCallback]);

  return (
    <div className="ContainerList">
      <h2 className="ContainerListHeader">These are my containers</h2>
      <br />
      <div className="ContainerGridWrapper">
        <div className="ContainerGrid">
          {Object.values(containerData).map((c, index) => {
            return (
              <ContainerListItem
                key={c.id}
                containerid={c.id}
                name={c.name}
                deleteContainer={deleteContainer}
                position={index}
              />
            );
          })}

          <NewContainerButton
            position={() => containerData.length}
            new={getContainersCallback}
          />
        </div>
      </div>
    </div>
  );
}

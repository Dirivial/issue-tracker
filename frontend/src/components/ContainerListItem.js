import { useNavigate } from "react-router-dom";

import "./ContainerListItem.css";

export default function ContainerListItem({ containerid, name }) {
  const navigate = useNavigate();

  const openContainer = () => {
    navigate("/containers/" + containerid);
  };

  return (
    <div className="containerCard" onClick={openContainer}>
      <h4 className="cardTitle">{name}</h4>
    </div>
  );
}

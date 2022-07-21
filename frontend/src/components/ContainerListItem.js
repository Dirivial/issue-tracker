import { useNavigate } from 'react-router-dom';

import './ContainerListItem.css';

export default function ContainerListItem(props) {

    const navigate = useNavigate();

    const openContainer = () => {
        navigate("/containers/" + props.containerid);
    }

    return (
        <div className="containerCard">
            <h4 className="cardTitle">
                {props.name}
            </h4>
            <button className="OpenBtn" onClick={openContainer}>Open</button>
        </div>
    )
}

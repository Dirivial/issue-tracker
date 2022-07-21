import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';
import './ContainerListItem.css';

export default function ContainerListItem(props) {

    const navigate = useNavigate();

    const openContainer = () => {
        navigate("/containers/" + props.containerid);
    }

    const deleteContainer = () => {
        props.deleteContainer(props.containerid);
    }

    return (
        <div className="containerCard">
            <h4 className="cardTitle">
                {props.name}
            </h4>
            <button className="openBtn cardBtn" onClick={openContainer}>Open</button>
            <button className="deleteButton cardBtn" onClick={deleteContainer}><FontAwesomeIcon icon={faX} /></button>
        </div>
    )
}

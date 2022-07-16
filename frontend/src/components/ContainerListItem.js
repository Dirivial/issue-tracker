import { useNavigate } from 'react-router-dom';

import './ContainerListItem.css';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';



export default function ContainerListItem(props) {

    const navigate = useNavigate();

    const openContainer = () => {
        navigate("/containers/" + props.containerid);
    }

    return (
        <div className="containerCardCard">
            <Card bsPrefix="" className="containerCardCard" style={{ width: '12rem' }}>
                <Card.Body className="containerCard text-center">
                <Card.Title as="p" >{props.name}</Card.Title>
                <button variant="primary" className="OpenBtn" onClick={openContainer}>Open</button>
                </Card.Body>
            </Card>
        </div>
    )

}

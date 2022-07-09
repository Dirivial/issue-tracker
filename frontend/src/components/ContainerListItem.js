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
        <div>
            <Card bsPrefix="" bg={'dark'} style={{ width: '12rem' }}>
                <Card.Img variant="top" src="/horse_by_ocean.jpg" />
                <Card.Body className="text-center">
                <Card.Title as="p" >{props.name}</Card.Title>
                <button variant="primary" className="OpenBtn" onClick={openContainer}>Open</button>
                </Card.Body>
            </Card>
        </div>
    )

}

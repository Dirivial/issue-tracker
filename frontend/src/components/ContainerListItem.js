import './ContainerListItem';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function ContainerListItem(props) {

    return (
        <div>
            <Card bsPrefix="" bg={'dark'} style={{ width: '12rem' }}>
                <Card.Img variant="top" src="/horse_by_ocean.jpg" />
                <Card.Body>
                <Card.Title as="p" >{props.name}</Card.Title>
                <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </div>
    )

}

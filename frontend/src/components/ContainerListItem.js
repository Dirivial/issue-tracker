import './ContainerListItem';

import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export default function ContainerListItem(props) {

    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="/horse_by_ocean.jpg" />
                <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
                </Card.Body>
            </Card>
        </div>
    )

}

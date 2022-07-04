import React, { useState, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Axios from 'axios'; 

import {AccountContext} from '../context';

export default function NewContainerButton() {

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="NewContainerButton">
            <Button className="" onClick={() => setShowModal(true)}>Create Container</Button>

            <NewContainerPopup
                onHide={() => setShowModal(false)}
                show={showModal}
            />
        </div>
    )
}

function NewContainerPopup(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const {token, userId} = useContext(AccountContext)

    function submitContainer() {
        const headers = {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": 'Bearer ' + token
        };
        Axios.post('http://localhost:8081/create-container', 
            {
                name: name,
                description: description,
                userid: userId.userid,
            },
            headers).then((response) => {
                props.onHide();
            }).catch((error) => {
                setErrorMsg('Could not create user');
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
            }); 

    }

    return (
        <div className="NewContainerButton">
            <Modal 
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Create New Container
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form style={{ maxWidth: 700}} className="">
                        <Form.Group className="" controlId="containerName">
                            <Form.Label className="float-left">Name of container</Form.Label>
                            <Form.Control type="email" value={name} placeholder="Enter a name" onChange={e => {setName(e.target.value)}}/>
                        </Form.Group>
                    </form>                
                </Modal.Body>
                <Modal.Footer>
                    <Button className="float-left"onClick={props.onHide}>Close</Button>
                    <Button onClick={() => submitContainer()}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

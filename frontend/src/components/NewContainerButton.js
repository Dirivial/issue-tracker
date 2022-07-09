import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js'; 
import useAuth from '../hooks/useAuth.js';

import './NewContainerButton.css';

export default function NewContainerButton() {

    const [showModal, setShowModal] = useState(false);

    return (
        <div className="NewContainerComponent">
            <button className="NewContainerBtn" onClick={() => setShowModal(true)}>New Container</button>

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

    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    async function submitContainer() {
        try {
            const response = axiosPrivate.post('/container/create', 
                {
                    name: name,
                    description: description,
                    userid: auth.userid,
                }, { 
                    "Content-type": "application/json; charset=UTF-8",
                });
            props.onHide();
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
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
                            <Form.Control autoComplete="off" type="text" value={name} placeholder="Enter a name" onChange={e => {setName(e.target.value)}}/>
                        </Form.Group>
                        <Form.Group className="" controlId="containerName">
                            <Form.Label className="float-left">Description</Form.Label>
                            <Form.Control autoComplete="off" type="text" value={description} placeholder="Enter a description" onChange={e => {setDescription(e.target.value)}}/>
                        </Form.Group>
                    </form>                
                </Modal.Body>
                <Modal.Footer>
                    {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}
                    <Button className="float-left"onClick={props.onHide}>Close</Button>
                    <Button onClick={() => submitContainer()}>Create</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import axios from '../api/axios.js';

export default function RegisterUserPopup(props) {

    const [mail, setMail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)

    function handleKeyDown(event) {

    }

    async function submitInformation() {
        try {
            await axios.post('/register', 
                {
                    mail,
                    username,
                    password
                },
                {
                    headers: { 'Content-type': 'application/json' },
                    withCredentials: true
                }
            );
            props.onHide();
        } catch (err) {
            if (!err?.response) {
                setErrorMsg('No server response.');
            } else if (err.response?.status === 409) {
                setErrorMsg('The given Email is already in use.');
            } else {
                setErrorMsg('Registration failed');
            }
        }
        
    }

    return (
        <div className="NewIssuePopup">
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Register
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form style={{ maxWidth: 700}} className="">
                        <Form.Group className="loginInput" controlId="formBasicEmail">
                            <Form.Label className="float-left">Email</Form.Label>
                            <Form.Control type="email" value={mail} placeholder="Enter email" onChange={e => {setMail(e.target.value)}}/>
                        </Form.Group>
                        <Form.Group className="loginInput" controlId="formBasicUsername">
                            <Form.Label className="float-left">Username</Form.Label>
                            <Form.Control type="user" value={username} placeholder="Username" onChange={e => {setUsername(e.target.value)}}/>
                        </Form.Group>

                        <Form.Group className="loginInput" controlId="formBasicPassword">
                            <Form.Label className="float-left">Password</Form.Label>
                            <Form.Control type="password" value={password} placeholder="Password" onKeyDown={e => {handleKeyDown(e)}} onChange={e => {setPassword(e.target.value)}} />
                        </Form.Group>
                    </form>                
                </Modal.Body>
                <Modal.Footer>
                    {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}
                    <Button className="float-left"onClick={props.onHide}>Close</Button>
                    <Button onClick={submitInformation}>Submit</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import Axios from 'axios';

export default function RegisterUserPopup(props) {

    const [mail, setMail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState(null)

    function handleKeyDown(event) {

    }

    function submitInformation() {
        Axios.post('http://localhost:3001/create', 
            {
                mail: mail,
                username: username,
                password: password
            }).then((response) => {
                console.log("Error");
                console.log(response);
            }); 
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
                    <Button className="float-left"onClick={props.onHide}>Close</Button>
                    <Button onClick={submitInformation}>Submit</Button>
                    {errorMsg ? <p style={{color: 'red'}}>{errorMsg}</p> : null}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

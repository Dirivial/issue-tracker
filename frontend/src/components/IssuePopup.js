import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './IssuePopup.css';

export default function IssuePopup(props) {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const submit = () => {

        try {
            const listinfo = props.currentlist();
            const response = axiosPrivate.post('/issue/create', 
                {
                    name: name,
                    description: description,
                    position: listinfo.position,
                    listid: listinfo.listid
                });
            props.issueCreated();
            props.onHide();
        } catch (err) {
            console.log(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }


    return (
        <div className="NewIssuePopup">
            <Modal 
                show={props.show}
                onHide={props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                backdrop="static"
                contentClassName="normalBackground"
                >
                <div className="modalHeader normalBackground">
                    <h2 className="issueHeader">New Issue</h2>
                </div>
                <Modal.Body className="normalBackground" >
                    <Form.Group className="issueNameForm" controlId="formName">
                        <Form.Label className="float-left">Name</Form.Label>
                        <Form.Control type="text" value={name} placeholder="Issue" onChange={e => {setName(e.target.value)}}/>
                    </Form.Group>

                    <Form.Group className="issueDescriptionForm" controlId="formDescription">
                        <Form.Label className="float-left">Description</Form.Label>
                        <Form.Control type="textarea" value={description} placeholder="Description" onChange={e => {setDescription(e.target.value)}}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer bsPrefix="normalBackground customFoot">
                    <button onClick={props.onHide} className="closeButton">Close</button>
                    <button onClick={submit} className="saveButton">Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

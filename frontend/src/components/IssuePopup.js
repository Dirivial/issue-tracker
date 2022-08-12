import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './IssuePopup.css';

export default function IssuePopup({sentIssue, position, listid, onCreated, show, onHide}) {

    const [issue, setIssue] = useState({});
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const axiosPrivate = useAxiosPrivate();

    const submit = async () => {

        try {
            let myIssue = {...issue};
            myIssue.name = name;
            myIssue.description = description;
            myIssue.position = position();
            const response = await axiosPrivate.post('/issue/create', myIssue);

            myIssue.id = response.data.id;
            onCreated(issue);
            onHide();
        } catch (err) {
            console.log(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    useEffect(() => {
        setIssue(sentIssue());
    }, [sentIssue])

    useEffect(() => {
        if(issue != null) {
            setName(issue.name);
            setDescription(issue.description);
        }
    }, [issue])

    return (
        <div className="NewIssuePopup">
            <Modal 
                show={show}
                onHide={onHide}
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
                        <textarea value={description} placeholder="Description" onChange={e => {setDescription(e.target.value)}}/>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer bsPrefix="normalBackground customFoot">
                    <button onClick={onHide} className="closeButton">Close</button>
                    <button onClick={submit} className="saveButton">Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

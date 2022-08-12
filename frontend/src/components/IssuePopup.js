import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './IssuePopup.css';

export default function IssuePopup({issue, updateIssue, position, listid, onCreated, show, onHide}) {

    const [name, setName] = useState(issue ? issue().name : '');
    const [description, setDescription] = useState(issue ? issue().description : '');
    const [done, setDone] = useState(issue ? issue().done : false);
    const axiosPrivate = useAxiosPrivate();

    const create = async () => {
        try {
            let myIssue = {
                name: name,
                description: description,
                position: position(),
                listid: listid,
                done: done
            };
            const response = await axiosPrivate.post('/issue/create', myIssue);

            myIssue.id = response.data.id;
            onCreated(myIssue);
            onHide();
        } catch (err) {
            console.log(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const update = async () => {
        try {
            let myIssue = {
                name: name,
                description: description,
                position: issue().position,
                listid: issue().listid,
                issueid: issue().issueid,
                done: issue().done
            };
            await axiosPrivate.post('/issue/update', myIssue);
            
            updateIssue(myIssue);
        } catch (err) {
            console.log(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

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
                    <h2 className="issueHeader">{issue ? "Edit Issue" : "New Issue"}</h2>
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
                    <button onClick={() => {issue ? update() : create()}} className="saveButton">Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

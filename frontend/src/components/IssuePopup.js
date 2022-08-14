import { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import TextAreaAuto from 'react-textarea-autosize';
import ReactMarkdown from 'react-markdown';
import RemarkGFM from 'remark-gfm';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './IssuePopup.css';

export default function IssuePopup({issue, updateIssue, position, listid, onCreated, show, onHide}) {

    const [name, setName] = useState(issue ? issue().name : '');
    const [description, setDescription] = useState(issue ? issue().description : '');
    const [done, setDone] = useState(issue ? issue().done : false);
    const [renderMarkdown, setRenderMarkdown] = useState(true);
    const textAreaRef = useRef();
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

    const editMarkdown = () => {
        setRenderMarkdown(false);
    }

    useEffect(() => {
        if(!renderMarkdown) textAreaRef.current.focus();
    }, [renderMarkdown])

    return (
        <div className="NewIssuePopup">
            <Modal 
                show={show}
                onHide={onHide}
                aria-labelledby="contained-modal-title-vcenter"
                size="lg"
                centered
                backdrop="static"
                contentClassName="normalBackground"
                >
                <div className="modalHeader normalBackground">
                    <h2 className="issueHeader">{issue ? "Edit Issue" : "New Issue"}</h2>
                </div>
                <Modal.Body className="normalBackground modalBody" >
                    <div className="modalBodyGroup issueNameForm">
                        <Form.Label className="">Name</Form.Label>
                        <input type="text" className="modalInput" value={name} placeholder="Name" onChange={e => {setName(e.target.value)}}/>
                    </div>

                    <br />
                    <div onClick={null} className="modalBodyGroup">
                        <Form.Label className="">Description</Form.Label>
                        {renderMarkdown ? 
                            <div onClick={editMarkdown} className="markdownWrapper"><ReactMarkdown className="renderedMarkdown" children={description} remarkPlugins={[RemarkGFM]}/></div> : 
                            <TextAreaAuto ref={textAreaRef} onBlur={() => setRenderMarkdown(true)} className="modalTextArea" value={description} placeholder="Description" onChange={e => {setDescription(e.target.value)}}/>
                        }
                    </div>
                </Modal.Body>
                <Modal.Footer bsPrefix="normalBackground customFoot">
                    <button onClick={onHide} className="closeButton">Close</button>
                    <button onClick={() => {issue ? update() : create()}} className="saveButton">Save</button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

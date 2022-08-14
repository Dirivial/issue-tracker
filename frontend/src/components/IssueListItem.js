import { useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import IssuePopup from './IssuePopup.js';
import "./IssueListItem.css";

export default function IssueListItem({name, remove, issueid, position, description, listid, done}) {

    const [issuePopupShow, setIssuePopupShow] = useState(false);

    const [issue, setIssue] = useState({
        name: name,
        issueid: issueid,
        position: position,
        description: description,
        done: done,
        listid: listid
    });

    const removeIssue = () => {
        remove(position);
    }

    const openModal = () => {
        setIssuePopupShow(true);
    }

    const closeModal = () => {
        setIssuePopupShow(false);
    }

    const updateIssue = (updatedIssue) => {
        setIssue(updatedIssue)
        setIssuePopupShow(false);
    }

    return (
        <div onClick={null}>
            <Draggable
                key={issueid}
                draggableId={"Issue" + issueid}
                index={position}
                type="ISSUE"
            >
                {(provided, snapshot) => {
                    return (
                        <div
                            className="issue-list-item"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                                ...provided.draggableProps.style
                            }}
                            onClick={() => openModal()}
                        >
                            <h4 className="issue-name">{issue.name}</h4>
                            <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                            {provided.placeholder}
                        </div>
                    )
                }}
            </Draggable>
            <IssuePopup 
                issue={() => issue}
                updateIssue={(updatedIssue) => updateIssue(updatedIssue)}
                show={issuePopupShow}
                onHide={closeModal}
                />
        </div>
    )
}

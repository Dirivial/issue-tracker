import { useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faCheck } from '@fortawesome/free-solid-svg-icons';

import "./IssueListItem.css";

export default function IssueListItem({name, remove, issueIndex, listid, issueid, position, description, dragStart, dragEnter}) {

    const [issueName, setIssueName] = useState(name);
    
    const removeIssue = () => {
        remove(issueid);
    }

    return (
        <Draggable
            key={issueid}
            draggableId={"" + issueid}
            index={position}
        >
            {(provided, snapshot) => {
                return (
                    <div
                        className="issue-list-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            userSelect: "none",
                            ...provided.draggableProps.style
                        }}
                        
                    >
                        <input type='text' value={issueName} className="issue-name" onChange={(e) => (setIssueName(e.target.value))}/>
                        <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                        {provided.placeholder}
                    </div>
                )
            }}
        </Draggable>
    )
}

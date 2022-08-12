import { useState } from 'react';

import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faCheck } from '@fortawesome/free-solid-svg-icons';

import "./IssueListItem.css";

export default function IssueListItem({name, remove, issueid, position, description}) {

    const [issueName, setIssueName] = useState(name);
    
    const removeIssue = () => {
        remove(position);
    }

    return (
        <Draggable
            key={issueid}
            draggableId={"" + issueid}
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
                        
                    >
                        <h4 className="issue-name">{issueName}</h4>
                        <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                        {provided.placeholder}
                    </div>
                )
            }}
        </Draggable>
    )
}

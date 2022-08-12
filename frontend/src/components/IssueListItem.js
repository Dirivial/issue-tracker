import { Draggable } from 'react-beautiful-dnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import "./IssueListItem.css";

export default function IssueListItem({open, name, remove, issueid, position, description}) {

    const removeIssue = () => {
        remove(position);
    }

    const openIssue = () => {
        open();
    }

    return (
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
                        onClick={openIssue}
                    >
                        <h4 className="issue-name">{name}</h4>
                        <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
                        {provided.placeholder}
                    </div>
                )
            }}
        </Draggable>
    )
}

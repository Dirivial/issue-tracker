import { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEllipsisVertical, faCheck } from '@fortawesome/free-solid-svg-icons';

import "./IssueListItem.css";

export default function IssueListItem({name, remove, issueid, position, description}) {

    const [issueName, setIssueName] = useState(name);
    
    const removeIssue = () => {
        remove(issueid);
    }

    return (
        <div className="issue-list-item">
            <input type='text' value={issueName} className="issue-name" onChange={(e) => (setIssueName(e.target.value))}/>
            <button onClick={removeIssue}><FontAwesomeIcon icon={faEllipsisVertical} /></button>
        </div>
    )
}

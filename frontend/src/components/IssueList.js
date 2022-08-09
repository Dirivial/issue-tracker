import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';
import { Droppable } from 'react-beautiful-dnd';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';

import IssuePopup from '../components/IssuePopup.js';
import IssueListItem from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList(props) {
    
    const [listName, setListName] = useState(props.name ? props.name : 'New list');
    const [issues, setIssues] = useState([]);
    const [data, setData] = useState([]);
    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const removeIssue = async (issueid) => {
        setIssues(prev => prev.filter((issue) => {return issue.props.issueid !== issueid}));

        try {
            const response = await axiosPrivate.get('/issue/remove?issueid=' + issueid);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const sendUpdateList = () => {
        props.update({
            name: listName,
            id: props.listid,
            position: props.position,
        });
    }

    const removeList = () => {
        props.remove(props.listid);
    }


    const launchIssuePopup = () => {
        setIssuePopupShow(true);
    }
    return (
        <div className="issue-list">
            <div key={'list-name-wrapper'} className="list-name-wrapper">
                <input className="list-name" onBlur={sendUpdateList} value={listName} placeholder={listName} onChange={(e) => (setListName(e.target.value))}/>
                <button className="list-delete-button" onClick={removeList}><FontAwesomeIcon icon={faX} /></button>
            </div>

            <div className="list-of-issues-wrapper">
                <Droppable droppableId={props.position.toString()} key={props.position}>
                    {(provided, snapshot) => {
                        return (
                            <div 
                                {...props.providedThing.droppableProps}
                                className="list-of-issues"
                                ref={provided.innerRef}>
                                {props.issues.map((issue, index) => {
                                    return (
                                        <IssueListItem
                                            key={issue.id}
                                            listid={issue.listid}
                                            issueid={issue.id}
                                            position={index}
                                            name={issue.name}
                                            description={issue.description}
                                            remove={removeIssue}
                                        />
                                    );
                                })}
                                {provided.placeholder}
                            </div>
                        )
                    }}
                </Droppable>
            </div>

            <button className="new-issue-button" onClick={launchIssuePopup}>New Issue</button>
            <IssuePopup
                currentlist={() => {return {listid: props.listid, position: issues.length}}}
                issueCreated={null}
                show={issuePopupShow}
                onHide={() => {setIssuePopupShow(false)}}
            />
        </div>
    )
}

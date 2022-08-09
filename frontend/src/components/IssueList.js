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
    const [issues, setIssues] = useState(props.issues);
    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const removeIssue = async (position) => {

        let issue = null;

        setIssues(old => {
            let newIssues = old;
            issue = newIssues.splice(position, 1)[0];
            for(let i = position; i < newIssues.length; i++) {
                newIssues[i].position -= 1;
            }
            return newIssues;
        });

        try {
            const response = await axiosPrivate.get('/issue/remove?issueid=' + issue.id);

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

    const addIssue = (issue) => {
        props.addIssue(issue)
    }

    const launchIssuePopup = () => {
        setIssuePopupShow(true);
    }
    return (
        <div className="issue-list">
            <div key={'list-name-wrapper'} className="list-name-wrapper">
                <input className="list-name" onBlur={sendUpdateList} value={listName} placeholder={listName} onChange={(e) => (setListName(e.target.value))}/>
                <button onClick={removeList}><FontAwesomeIcon icon={faX} /></button>
            </div>

            <div className="list-of-issues-wrapper">
                <Droppable droppableId={props.position.toString()} key={props.position}>
                    {(provided, snapshot) => {
                        return (
                            <div 
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="list-of-issues">
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
                        );
                    }}
                </Droppable>
            </div>

            <button className="new-issue-button" onClick={launchIssuePopup}>New Issue</button>
            <IssuePopup
                currentlist={() => {return {listid: props.listid, position: issues.length}}}
                position={() => {return props.issues.length}}
                listid={props.listid}
                onCreated={(issue) => {addIssue(issue)}}
                show={issuePopupShow}
                onHide={() => {setIssuePopupShow(false)}}
            />
        </div>
    )
}

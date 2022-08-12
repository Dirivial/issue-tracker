import { useState, useEffect, useRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import useAxiosList from '../hooks/useAxiosList.js';

import IssuePopup from '../components/IssuePopup.js';
import IssueListItem from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList(props) {
    
    const [listName, setListName] = useState(props.name ? props.name : 'New list');
    const [listNameBefore, setListNameBefore] = useState(listName);
    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const myRef = useRef();
    const axiosList = useAxiosList();

    const removeIssue = async (id, position) => {
        props.removeIssue(position);
        await axiosList('/issue/remove?issueid=' + id);
    }

    const sendUpdateList = () => {
        setListNameBefore(listName);
        props.update({
            name: listName,
            id: props.listid,
            position: props.position,
        });
    }

    const removeList = async () => {
        props.remove(props.position);
        await axiosList('/issueList/remove?listid=' + props.listid);
    }

    const addIssue = (issue) => {
        props.addIssue(issue);
    }

    const launchIssuePopup = () => {
        setIssuePopupShow(true);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            myRef.current.blur();
        } else if (e.key === 'Escape') {
            setListName(listNameBefore);
            myRef.current.blur();
        }
    }

    return (
        <Draggable
            draggableId={props.listid + ""}    
            index={props.position}
            type="LIST"
        >
            {(provided, snapshot) => {
                return (
                    <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            margin: "0px 10px 0px 0px",
                            ...provided.draggableProps.style
                        }}
                        className="issue-list">
                        <div key={'list-name-wrapper'} className="list-name-wrapper">
                            <input ref={myRef} className="list-name" onKeyDown={e => {handleKeyDown(e)}} onBlur={sendUpdateList} value={listName} placeholder={listName} onChange={(e) => (setListName(e.target.value))}/>
                            <button onClick={removeList}><FontAwesomeIcon icon={faX} /></button>
                        </div>

                        <div className="list-of-issues-wrapper">
                            <Droppable type="ISSUE" droppableId={props.position.toString()} key={props.position}>
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
                                                        remove={() => removeIssue(issue.id, index)}
                                                    />
                                                );
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    );
                                }}
                            </Droppable>
                        </div>

                        <button className="new-issue-button" onClick={launchIssuePopup}><FontAwesomeIcon icon={faPlus}/></button>
                        <IssuePopup
                            position={() => {return props.issues.length}}
                            listid={props.listid}
                            onCreated={(issue) => {addIssue(issue)}}
                            show={issuePopupShow}
                            onHide={() => {setIssuePopupShow(false)}}
                        />
                        {provided.placeholder}
                    </div>
                );
            }}
        </Draggable>
    )
}

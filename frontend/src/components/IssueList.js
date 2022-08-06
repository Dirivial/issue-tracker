import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';

import IssuePopup from '../components/IssuePopup.js';
import IssueListItem from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList({name, remove, update, listid, position, dragStart, dragEnter, isDragging}) {
    
    const [listName, setListName] = useState(name ? name : 'New list');
    const [issues, setIssues] = useState([]);
    const [data, setData] = useState([]);
    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const getIssues = async () => {
        try {
            const response = await axiosPrivate.get('/issue/?listid=' + listid);
            if(response?.data !== data) {
                setData(response.data);
            }

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

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
        update({
            name: name,
            id: listid,
            position: position,
        });
    }

    const removeList = () => {
        remove(listid);
    }


    const launchIssuePopup = () => {
        setIssuePopupShow(true);
    }

    const handleDragStart = (e, params) => {
        dragStart(e, params);
    }

    const handleDragEnter = (e, params) => {
        dragEnter(e, params);
    }
    useEffect(() => {
        getIssues();
    }, [])

    useEffect(() => {
        if(data.length > 0) {
            let allIssues = [];
            for (let i = 0; i < data.length; i++) {
                let issue = data[i];
                allIssues.push(<IssueListItem 
                    remove={removeIssue}
                    key={issue.id} 
                    issueid={issue.id}
                    postition={issue.position} 
                    name={issue.name} 
                    description={issue.description}/>);
            }
            setIssues(allIssues);
        }
    }, [data]);

    return (
        <div className="issue-list">
            <div className="list-name-wrapper">
                <input className="list-name" onBlur={sendUpdateList} value={name} placeholder={name} onChange={(e) => (setListName(e.target.value))}/>
                <button className="" onClick={removeList}><FontAwesomeIcon icon={faX} /></button>
            </div>

            <div className="list-of-items">
                {issues.map((item, itemI) => (
                    <div draggable key={itemI} onDragStart={(e) => handleDragStart(e, {position, itemI})} onDragEnter={isDragging?(e)=>{handleDragEnter(e, {position, itemI})}:null}>
                        {item}
                    </div>
                ))}
            </div>

            <button className="new-issue-button" onClick={launchIssuePopup}>New Issue</button>
            <IssuePopup
                currentlist={() => {return {listid: listid, position: issues.length}}}
                issueCreated={getIssues}
                show={issuePopupShow}
                onHide={() => {setIssuePopupShow(false)}}
            />
        </div>
    )
}

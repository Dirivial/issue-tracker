import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate.js';

import IssueListItem from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList(props) {
    
    const [name, setName] = useState(props.name ? props.name : 'New list');
    const [issues, setIssues] = useState([]);
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const getIssues = async () => {
        try {
            const response = await axiosPrivate.get('/issue/?listid=' + props.listid);
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

    const removeList = () => {
        props.remove(props.listid);
    }


    const launchIssuePopup = () => {
        props.issuePopup({listid: props.listid, position: issues.length});
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
                <input className="list-name" value={name} placeholder={name} onChange={(e) => (setName(e.target.value))}/>
                <button onClick={removeList}>X</button>
            </div>

            <div className="list-of-items">
                {issues}
            </div>

            <button className="new-issue-button" onClick={launchIssuePopup}>New Issue</button>
        </div>
    )
}

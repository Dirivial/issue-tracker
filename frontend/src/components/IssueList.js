import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate.js';

import Button from 'react-bootstrap/Button'
import Issue from '../components/IssueListItem.js';
import './IssueList.css';

export default function IssueList(props) {
    
    const [name, setName] = useState(props.name ? props.name : 'New list');
    const [issues, setIssues] = useState([]);
    const [data, setData] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const nameUpdated = (e) => {
        setName(e);
    } 

    const getIssues = async () => {
        try {
            const response = await axiosPrivate.get('/issue/get-in?listid=' + props.listid);
            if(response?.data !== data) {
                console.log(response.data);
                setData(response.data);
            }

        } catch (err) {
            console.log(err);
            //navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const launchIssuePopup = () => {
        props.issuePopup({listid: props.listid, position: issues.length});
    }

    useEffect(() => {
        getIssues();
    }, [])

    useEffect(() => {
        if(data.length > 0) {
            setIssues([]);
            for (let i = 0; i < data.length; i++) {
                let issue = data[i];
                setIssues(prev => [...prev, <Issue 
                    key={issue.id} 
                    postition={issue.position} 
                    name={issue.name} 
                    description={issue.description}/>]);
            }
            console.log("Issues: ");
            console.log(issues);
        }
    }, [data]);

    return (
        <div className="issue-list">
            <div className="list-name-wrapper">
                <input className="list-name" value={name} placeholder={name} onChange={(e) => ((e.target.value))}/>
            </div>

            <div className="list-of-items">
                {issues}
            </div>

            <Button onClick={launchIssuePopup}>New Issue</Button>
        </div>
    )
}

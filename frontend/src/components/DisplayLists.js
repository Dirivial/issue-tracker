import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import IssueList from '../components/IssueList.js';
import IssuePopup from '../components/IssuePopup.js';

export default function DisplayLists(props) {

    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const [data, setData] = useState([]);
    const [lists, setLists] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const createNewList = async () => {
        try {
            const response = await axiosPrivate.post('/issueList/create', {
                name: 'New list',
                position: lists.length,
                containerid: props.containerid
            });
            getLists();

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const getLists = async () => {
        try {
            const response = await axiosPrivate.get('/issueList/get-in?containerid=' + props.containerid);
            if(response?.data !== data) {
                setData(response?.data);
            }

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const launchIssuePopup = () => {
        setIssuePopupShow(true);
    }

    useEffect(() => {
        if(data.length > 0) {
            setLists([]);
            for (let i = 0; i < data.length; i++) {
                let list = data[i];
                setLists(prev => [...prev, <IssueList key={list.id} name={list.name}/>]);
            }
        }
    }, [data]);

    useEffect(() => {
        getLists();
    }, []);

    return (
        <div className="IssueListsContainer">
            { lists }
            <button className="NewListBtn" onClick={createNewList}>New list</button>
            <IssuePopup
                show={issuePopupShow}
                onHide={() => {setIssuePopupShow(false)}}
            />
        </div>
    )
}

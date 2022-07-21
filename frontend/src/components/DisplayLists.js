import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './DisplayLists.css';

import IssueList from '../components/IssueList.js';
import IssuePopup from '../components/IssuePopup.js';

export default function DisplayLists(props) {

    const [issuePopupShow, setIssuePopupShow] = useState(false);
    const [activeListInfo, setActiveListInfo] = useState({});
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
            const response = await axiosPrivate.get('/issueList/?containerid=' + props.containerid);
            if(response?.data !== data) {
                setData(response?.data);
            }

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const removeList = async (listid) => {
        setLists(prev => prev.filter((list) => {return list.props.listid !== listid}));

        try {
            const response = await axiosPrivate.get('/issueList/remove?listid=' + listid);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const launchIssuePopup = (listinfo) => {
        setActiveListInfo(listinfo);
        setIssuePopupShow(true);
    }

    const getActiveListInfo = () => {
        return activeListInfo;
    }

    useEffect(() => {
        if(data.length > 0) {
            let allLists = [];
            for (let i = 0; i < data.length; i++) {
                let list = data[i];
                allLists.push(<IssueList 
                    key={list.id} 
                    remove={removeList}
                    listid={list.id}
                    postition={list.position} 
                    name={list.name}
                    issuePopup={launchIssuePopup}/>);
            }
            setLists(allLists);
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
                currentlist={getActiveListInfo}
                show={issuePopupShow}
                onHide={() => {setIssuePopupShow(false)}}
            />
        </div>
    )
}

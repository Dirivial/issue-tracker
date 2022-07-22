import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import DisplayLists from '../components/DisplayLists.js';
import './Container.css';


export default function Container() {

    const [data, setData] = useState({});
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [allowUpdate, setAllowUpdate] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const sendContainerUpdate = async () => {
        if(!allowUpdate) return;
        try {
            const response = await axiosPrivate.post('/container/update', {
                name: name,
                description: desc,
                containerid: id
            });
            setAllowUpdate(false);
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const getContainerInfo = async () => {
        try {
            const response = await axiosPrivate.get('/container/get?id=' + id);
            setData(response?.data);
            setName(response?.data?.name);
            setDesc(response?.data?.description);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    useEffect(() => {
        setAllowUpdate(true);
    }, [name])

    useEffect(() => {
        setAllowUpdate(true);
    }, [desc])

    useEffect(() => {
        getContainerInfo();
    }, [])

    return (
    <div className="container">
        <div className="containerHeader">
            <input className="containerTitle" onBlur={sendContainerUpdate} value={name} onChange={(e) => {setName(e.target.value)}} />
            <textarea className="containerDescription" value={desc} onBlur={sendContainerUpdate} onChange={(e) => {setDesc(e.target.value)}}/>
        </div>
        <DisplayLists containerid={id}/>

    </div>
    )
}



import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import DisplayLists from '../components/DisplayLists.js';
import './Container.css';


export default function Container() {

    const [data, setData] = useState({});
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();


    const getContainerInfo = async () => {
        try {
            const response = await axiosPrivate.get('/container/get?id=' + id);
            setData(response?.data);
            setName(response?.data?.name);
            setDesc(response?.data?.description);
            console.log(data);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    useEffect(() => {
        getContainerInfo();
    }, [])

    return (
    <div className="container">
        <div className="containerHeader">
            <input className="containerTitle" value={name} onChange={(e) => {setName(e.target.value)}} />
            <textarea className="containerDescription" value={desc} onChange={(e) => {setDesc(e.target.value)}}/>
        </div>
        <DisplayLists containerid={id}/>

    </div>
    )
}



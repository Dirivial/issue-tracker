import { axiosPrivate } from '../api/axios.js';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import NewContainerButton from '../components/NewContainerButton.js';
import ContainerListItem from '../components/ContainerListItem.js';

import './ContainerList.css';

export default function ContainerList() {

    const navigate = useNavigate();
    const location = useLocation();
    const [containerData, setContainerData] = useState({});
    const [containers, setContainers] = useState([]);

    const getContainers = async () => {
        try {
            const response = await axiosPrivate.get('/container/my-containers', { 
                    withCredentials: true
                });
            setContainerData(response?.data?.containers);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const buildContainerComponents = () => {
        for (let i = 0; i < containerData.length; i++) {
            setContainers(prev => [...prev, <ContainerListItem key={containerData[i].id} name={containerData[i].name}/>]);
        }
    }

    useEffect(() => {
        if(containerData.length > 0) {
            setContainers([]);
            buildContainerComponents();
        }
    }, [containerData]);

    useEffect(() => {
        getContainers();
    }, []);

    return (
    <div className="ContainerList">
        <h2 className="ContainerListHeader">These are my containers</h2>
        
        <div className="ContainerGridWrapper">
            <div className="ContainerGrid">
                { containers }
                <NewContainerButton />
            </div>
        </div>
    </div>
    )
}

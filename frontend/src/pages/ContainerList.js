import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import useAuth from '../hooks/useAuth.js';
import NewContainerButton from '../components/NewContainerButton.js';
import ContainerListItem from '../components/ContainerListItem.js';

import './ContainerList.css';

export default function ContainerList() {

    const navigate = useNavigate();
    const location = useLocation();
    const { auth } = useAuth();
    const [containerData, setContainerData] = useState({});
    const [containers, setContainers] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    const getContainers = async () => {
        try {
            const response = await axiosPrivate.get('/container/my-containers', { 
                    withCredentials: true
                });
            setContainerData(response?.data?.containers);

        } catch (err) {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const deleteContainer = async (containerid) => {
        try {
            const response = await axiosPrivate.post('/container/remove',
                {
                    containerid: containerid,
                    userid: auth.userid
                });
            getContainers();
        } catch (err) {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const buildContainerComponents = () => {
        let containers = [];
        for (let i = 0; i < containerData.length; i++) {
            let c = containerData[i];
            containers.push(<ContainerListItem key={c.id} containerid={c.id} name={c.name} deleteContainer={deleteContainer}/>);
        }
        setContainers(containers);
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
                <NewContainerButton new={getContainers}/>
            </div>
        </div>
    </div>
    )
}

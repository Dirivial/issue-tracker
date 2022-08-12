import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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
    const axiosPrivate = useAxiosPrivate();

    const getContainers = async () => {
        try {
            const response = await axiosPrivate.get('/container/my-containers', { 
                    withCredentials: true
                });
            let data = response?.data?.containers;
            data.sort((first, second) => first.position < second.position ? -1:1);
            setContainerData(data);

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

    const updateContainer = async (container) => {
        try {
            await axiosPrivate.post('/container/update', container);
        } catch (err) {
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    useEffect(() => {
        getContainers();
    }, []);

    const onDragEnd = (result) => {
        if(!result) return;

        setContainerData(prev => {
            let containers = [...prev];
            containers.splice(result.destination.index, 0, containers.splice(result.source.index, 1)[0]);
            containers.forEach((container, index) => {
                container.position = index;
                updateContainer(container);
            });
            return containers;
        });

    }

    return (
    <div className="ContainerList">
        <h2 className="ContainerListHeader">These are my containers</h2>
        <div className="ContainerGridWrapper">
            <DragDropContext onDragEnd={result => onDragEnd({destination: result.destination, source: result.source})}>
                <Droppable droppableId="Containers" direction="horizontal" type="CONTAINER">
                    {(provided, snapshot) => {
                        return (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="ContainerGrid"
                            >
                                {Object.values(containerData).map((c, containerIndex) => {
                                    return (
                                        <ContainerListItem 
                                            key={c.id}
                                            containerid={c.id}
                                            name={c.name}
                                            deleteContainer={deleteContainer}
                                            position={containerIndex}/>
                                    );
                                })}
                                {provided.placeholder}
                                <NewContainerButton new={getContainers}/>
                            </div>
                        );
                    }}
                </Droppable>
            </DragDropContext>
        </div>
    </div>
    )
}

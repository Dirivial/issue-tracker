import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import useAxiosPrivate from '../hooks/useAxiosPrivate.js';
import './DisplayLists.css';

import IssueList from './IssueList.js';
import IssueListItem from './IssueListItem.js';

export default function ListViewer({containerid}) {

    const [listData, setListData] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const dragItem = useRef();
    const dragItemNode = useRef();

    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();

    const createNewList = async () => {
        try {
            const response = await axiosPrivate.post('/issueList/create', {
                name: 'New list',
                position: listData.length,
                containerid: containerid
            });
            getLists();

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const getLists = async () => {
        try {
            const response = await axiosPrivate.get('/issueList/?containerid=' + containerid);
            if(response?.data !== listData) {

                let ids = [];
                response.data.forEach(e => ids.push(e.id));

                const response2 = await axiosPrivate.post('/issue/multi', {
                    listids: ids
                });

                if(response2?.data) {
                    let data = response.data;

                    data.forEach(list => {
                        list.issues = response2.data.filter(issue => issue.listid === list.id);
                        list.issues.sort((issueA, issueB) => issueA.position > issueB.position ? 1:-1);
                    })
                    setListData(data);
                }
            }

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const removeList = async (listid) => {
        setListData(prev => prev.filter((list) => {return list.listid !== listid}));

        try {
            const response = await axiosPrivate.get('/issueList/remove?listid=' + listid);
            syncListPosition(listid);

        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const updateList = async (list) => {
        try {
            const response = await axiosPrivate.post('/issueList/update', {
                id: list.id,
                name: list.name,
                position: list.position,
            });
        } catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    const syncListPosition = (listid) => {
        let allData = listData.filter((list) => {return list.id !== listid});
        for (let i = 0; i < allData.length; i++) {
            if(allData[i].position !== i) {
                allData[i].position = i;
                updateList(allData[i]);
            }
        }
    }

    useEffect(() => {
        getLists();
    }, []);

    const buildIssue = (issue) => {
        return (
            <div>
            </div>
        )
    }

    return (
        <div className="IssueListsContainer">
            <DragDropContext>
                {Object.values(listData).map((list, listIndex) => {
                    return (
                        <div key={listIndex}>
                            <Droppable droppableId={"" + list.id} key={listIndex}>
                                {(provided, snapshot) => {
                                    return (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                                padding: 4,
                                                minHeigth: 500
                                            }}
                                        >
                                            <IssueList 
                                                key={list.id}
                                                update={updateList}
                                                remove={removeList}
                                                name={list.name}
                                                listid={list.id}
                                                position={list.position}
                                                issues={list.issues}
                                                />
                                            {provided.placeholder}
                                        </div>
                                    )
                                }}
                            </Droppable>
                        </div>
                    )
                })}
            </DragDropContext>
            <button className="NewListBtn" onClick={createNewList}>New list</button>
        </div>
    )
}

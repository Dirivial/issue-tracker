import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DragDropContext } from 'react-beautiful-dnd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

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

    const onDragEnd = (result) => {
        if(!result.destination) return;
        console.log(result);

        setListData(old => {

            // Each contains index and droppableId
            let source = result.source;
            let destination = result.destination;
            
            let oldLists = JSON.parse(JSON.stringify(old));
            let issue = oldLists[source.droppableId].issues.splice(source.index, 1)[0];
            
            if (source.droppableId === destination.droppableId) {
                // Same droppable

                // Set positions for other issues in list
                for(let i = source.index; i < destination.index; i++) {
                    oldLists[source.droppableId].issues[i].position -= 1;
                }
                
                // Inser issue again, with new position
                issue.position = destination.index;
                oldLists[source.droppableId].issues.splice(destination.index, 0, issue);
            } else {
                // Between droppables

                // -1 on position for all issues following the issue in source list
                for(let i = source.index; i < oldLists[source.droppableId].issues.length; i++) {
                    oldLists[source.droppableId].issues[i].position -= 1;
                }
                // +1 on position on all issues following the issue in destination list
                for(let i = destination.index; i < oldLists[destination.droppableId].issues.length; i++) {
                    oldLists[destination.droppableId].issues[i].position += 1;
                }

                // Insert issue in new list
                issue.position = destination.index;
                issue.listid = oldLists[destination.droppableId].id;
                oldLists[destination.droppableId].issues.splice(destination.index, 0, issue);
            }
            return oldLists;
        });
    }

    const addIssue = (issue, listIndex) => {
        setListData(old => {
            old[listIndex].issues.push(issue);
            return [...old];
        });
    }

    const removeIssue = (issueIndex, listIndex) => {
        setListData(old => {
            let data = JSON.parse(JSON.stringify(old));
            data[listIndex].issues.splice(issueIndex, 1);
            for(let i = issueIndex; i < data[listIndex].issues.length; i++) {
                data[listIndex].issues[i].position -= 1;
            }
            return data;
        });
    }

    useEffect(() => {
        console.log(listData);
    }, [listData]);

    return (
        <div className="IssueListsContainer">
            <DragDropContext onDragEnd={result => onDragEnd({destination: result.destination, source: result.source})}>
                {Object.values(listData).map((list, listIndex) => {
                    return (
                        <IssueList 
                            key={list.id}
                            update={updateList}
                            remove={removeList}
                            name={list.name}
                            listid={list.id}
                            position={listIndex}
                            issues={list.issues}
                            index={listIndex}
                            addIssue={(issue) => addIssue(issue, listIndex)}
                            removeIssue={(issueIndex) => removeIssue(issueIndex, listIndex)}
                            />
                    );
                })}
            </DragDropContext>
            <button className="NewListBtn" onClick={createNewList}>New list</button>
        </div>
    )
}

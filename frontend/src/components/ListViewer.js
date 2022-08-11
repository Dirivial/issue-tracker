import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { DragDropContext } from 'react-beautiful-dnd';

import useListViewerReducer from '../reducers/listViewerReducer.js';
import useAxiosList from '../hooks/useAxiosList.js';
import './DisplayLists.css';

import IssueList from './IssueList.js';

export default function ListViewer({containerid}) {

    const [state, dispatch] = useListViewerReducer();
    const [listsChanged, setListsChanged] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const axiosList = useAxiosList();

    const createNewList = async () => {
        const result = await axiosList('/issueList/create', {
            name: 'New list',
            position: state.length,
            containerid: containerid,
        });
        // Reducer expects lists to have issues property
        result.issues = [];
        dispatch({type: 'addList', payload: result});
    }

    const syncList = async () => {
        // Create long list of issues to update
        let data = []; 
        listsChanged.forEach(i => {
            data.push(...state.at(parseInt(i)).issues);
        });
        setListsChanged([]);
        // Send issues to update
        axiosList('/issue/organize', {issues: data});
    }

    const getLists = async () => {
        const result = await axiosList('/issueList/?containerid=' + containerid);
        if(result) {
            let ids = [];
            result.forEach(e => ids.push(e.id));

            const result2 = await axiosList('/issue/multi', {
                listids: ids
            });

            if(result2) {
                let data = result;

                data.forEach(list => {
                    list.issues = result2.filter(issue => issue.listid === list.id);
                    list.issues.sort((issueA, issueB) => issueA.position > issueB.position ? 1:-1);
                })
                dispatch({type: 'load', payload: data});
            }
        }
    }

    const removeList = async (listid) => {
        syncListPositions(listid);
        dispatch({type: 'removeList', payload: listid});

        await axiosList('/issueList/remove?listid=' + listid);
    }

    const syncListPositions = (listid) => {
        let allData = state.filter(list => list.id !== listid);
        console.log(allData);
        for (let i = 0; i < allData.length; i++) {
            if(allData[i].position !== i) {
                updateList({id: allData[i].id, name: allData[i].name, position: i});
            }
        }
    }

    const updateList = async (list) => {
        console.log(list);
        await axiosList('/issueList/update', {
            id: list.id,
            name: list.name,
            position: list.position,
        })
    }

    useEffect(() => {
        getLists();
    }, []);

    useEffect(() => {
        if(listsChanged.length > 0) {
            syncList();
        }
    }, [listsChanged])

    const onDragEnd = (result) => {
        if(!result.destination) return;

        dispatch({type: 'moveIssue', payload: result});

        if(result.source.droppableId !== result.destination.droppableId) {
            setListsChanged([result.source.droppableId, result.destination.droppableId]);
        } else {
            setListsChanged([result.source.droppableId]);
        }
    }

    const addIssue = (issue, listIndex) => {
        dispatch({type: 'addIssue', payload: {issue, listIndex}})
    }

    const removeIssue = (issueIndex, listIndex) => {
        dispatch({type: 'removeIssue', payload: {issueIndex, listIndex}});
    }

    return (
        <div className="IssueListsContainer">
            <DragDropContext onDragEnd={result => onDragEnd({destination: result.destination, source: result.source})}>
                {Object.values(state).map((list, listIndex) => {
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

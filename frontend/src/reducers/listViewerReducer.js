import { useReducer } from 'react';

export default function useListViewerReducer() {
    return useReducer(reducerFunction, []);
}

function reducerFunction(state, action) {
    let newState = [...state];

    switch(action.type) {
        case 'load':
            newState = action.payload;
            break;
        case 'addIssue':
            newState[action.payload.listIndex].issues.push(action.payload.issue);
            break;
        case 'removeIssue':
            let data = JSON.parse(JSON.stringify(state));
            let listIndex = action.payload.listIndex;
            let issueIndex = action.payload.issueIndex;
            data[listIndex].issues.splice(issueIndex, 1);
            for(let i = issueIndex; i < data[listIndex].issues.length; i++) {
                data[listIndex].issues[i].position -= 1;
            }
            newState = data;
            break;
        case 'addList':
            const newList = action.payload;
            newState = [...newState, newList];
            break;
        case 'removeList':
            const index = newState.findIndex(list => list.id === action.payload);
            newState.splice(index, 1);
            for(let i = index; i < newState.length; i++) {
                newState[i].position = i;
            }
            break;
        case 'moveIssue':
            // Each contains index and droppableId
            let source = action.payload.source;
            let destination = action.payload.destination;
            
            let oldLists = JSON.parse(JSON.stringify(state));
            let issue = oldLists[source.droppableId].issues.splice(source.index, 1)[0];
            
            if (source.droppableId === destination.droppableId) {
                // Same droppable

                // Set positions for other issues in list
                let pos = (source.index < destination.index) ? 
                    {low: source.index, high: destination.index, dir: -1} 
                    : {low: destination.index, high: source.index, dir: 1}

                for(let i = pos.low; i < pos.high; i++) {
                    oldLists[source.droppableId].issues[i].position += pos.dir;
                }
                
                // Insert issue again, with new position
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
            newState = oldLists;
            break;
        default:
            return null;
    }

    return newState;
}

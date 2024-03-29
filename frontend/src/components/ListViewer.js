import { useState, useEffect, useCallback } from "react";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

import useListViewerReducer from "../reducers/listViewerReducer.js";
import useAxiosList from "../hooks/useAxiosList.js";
import "./ListViewer.css";

import IssueList from "./IssueList.js";

export default function ListViewer({ containerid }) {
  const [state, dispatch] = useListViewerReducer();
  const [listsChanged, setListsChanged] = useState([]);

  const axiosList = useAxiosList();

  const createNewList = async () => {
    const result = await axiosList("/issueList/create", {
      name: "New list",
      position: state.length,
      containerid: containerid,
    });
    // Reducer expects lists to have issues property
    result.issues = [];
    dispatch({ type: "addList", payload: result });
  };

  const removeList = async (position) => {
    let allData = [...state];
    for (let i = position + 1; i < allData.length; i++) {
      updateList({ id: allData[i].id, name: allData[i].name, position: i - 1 });
    }
    dispatch({ type: "removeList", payload: position });
  };

  const moveList = (source, destination) => {
    let lists = [...state];
    lists.splice(destination, 0, lists.splice(source, 1)[0]);
    for (let i = 0; i < lists.length; i++) {
      updateList({ id: lists[i].id, name: lists[i].name, position: i });
    }
  };

  const updateListName = (list) => {
    dispatch({ type: "updateListName", payload: list });
    updateList(list);
  };

  const updateList = async (list) => {
    await axiosList("/issueList/update", {
      id: list.id,
      name: list.name,
      position: list.position,
    });
  };

  const getListsCallback = useCallback(() => {
    const getLists = async () => {
      const result = await axiosList("/issueList/?containerid=" + containerid);
      if (result) {
        let ids = [];
        result.forEach((e) => ids.push(e.id));

        const result2 = await axiosList("/issue/multi", {
          listids: ids,
        });

        if (result2) {
          let data = result;

          data.forEach((list) => {
            list.issues = result2.filter((issue) => issue.listid === list.id);
            list.issues.sort((a, b) => (a.position < b.position ? -1 : 1));
          });
          dispatch({ type: "load", payload: data });
        }
      }
    };

    getLists();
  }, [dispatch, containerid]);

  useEffect(() => {
    getListsCallback();
  }, [getListsCallback]);

  // Sync changes to database when lists have been changed
  useEffect(() => {
    if (listsChanged.length > 0) {
      const syncList = async () => {
        // Create long list of issues to update
        let data = [];
        listsChanged.forEach((i) => {
          data.push(...state.at(parseInt(i)).issues);
        });
        setListsChanged([]);
        // Send issues to update
        axiosList("/issue/organize", { issues: data });
      };
      syncList();
    }
  }, [listsChanged, axiosList, state]);

  // User let go of a draggable item
  const onDragEnd = (result) => {
    if (!result.destination) return;

    // Check if user moved a list or an issue
    if (result.source.droppableId !== "ListsContainer") {
      dispatch({ type: "moveIssue", payload: result });

      if (result.source.droppableId !== result.destination.droppableId) {
        setListsChanged([
          result.source.droppableId,
          result.destination.droppableId,
        ]);
      } else {
        setListsChanged([result.source.droppableId]);
      }
    } else {
      dispatch({
        type: "moveList",
        payload: {
          source: result.source.index,
          destination: result.destination.index,
        },
      });
      moveList(result.source.index, result.destination.index);
    }
  };

  /* Dispatching functions for editing issues */
  const addIssue = (issue, listIndex) => {
    dispatch({ type: "addIssue", payload: { issue, listIndex } });
  };

  const removeIssue = (issueIndex, listIndex) => {
    dispatch({ type: "removeIssue", payload: { issueIndex, listIndex } });
  };

  const updateIssueContent = (issue, listIndex) => {
    dispatch({
      type: "updateIssue",
      payload: { issue, listIndex },
    });
  };

  return (
    <DragDropContext
      onDragEnd={(result) =>
        onDragEnd({ destination: result.destination, source: result.source })
      }
    >
      <Droppable
        droppableId="ListsContainer"
        direction="horizontal"
        type="LIST"
      >
        {(provided, snapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="IssueListsContainer"
            >
              {Object.values(state).map((list, listIndex) => {
                return (
                  <IssueList
                    key={list.id}
                    update={updateListName}
                    remove={removeList}
                    name={list.name}
                    listid={list.id}
                    position={listIndex}
                    issues={list.issues}
                    index={listIndex}
                    addIssue={(issue) => addIssue(issue, listIndex)}
                    removeIssue={(issueIndex) =>
                      removeIssue(issueIndex, listIndex)
                    }
                    updateIssue={(updatedIssue) =>
                      updateIssueContent(updatedIssue, listIndex)
                    }
                  />
                );
              })}
              {provided.placeholder}
              <button className="NewListBtn" onClick={createNewList}>
                New list
              </button>
            </div>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
}

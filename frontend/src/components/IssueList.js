import { useState, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TextAreaAuto from "react-textarea-autosize";
import Popup from "reactjs-popup";

import useAxiosList from "../hooks/useAxiosList.js";

import IssuePopup from "../components/IssuePopup.js";
import IssueListItem from "../components/IssueListItem.js";
import "./IssueList.css";

export default function IssueList(props) {
  const [listName, setListName] = useState(
    props.name ? props.name : "New list"
  );
  const [listNameBefore, setListNameBefore] = useState(listName);
  const [issuePopupShow, setIssuePopupShow] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const myRef = useRef(null);
  const axiosList = useAxiosList();

  const removeIssue = async (id, position) => {
    props.removeIssue(position);
    await axiosList("/issue/remove?issueid=" + id);
  };

  const sendUpdateList = () => {
    changeTitle(false);
    if (listName === listNameBefore) return;

    setListNameBefore(listName);
    props.update({
      name: listName,
      id: props.listid,
      position: props.position,
    });
  };

  const removeList = async () => {
    props.remove(props.position);
    await axiosList("/issueList/remove?listid=" + props.listid);
  };

  const addIssue = (issue) => {
    props.addIssue(issue);
  };

  const launchIssuePopup = () => {
    setIssuePopupShow(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      myRef.current.blur();
      changeTitle(false);
    } else if (e.key === "Escape") {
      setListName(listNameBefore);
      myRef.current.blur();
      changeTitle(false);
    }
  };

  const changeTitle = (value) => {
    setEditTitle((prev) => {
      if (value != null) {
        return value;
      }
      return !prev;
    });
  };

  return (
    <Draggable
      draggableId={"List" + props.listid}
      index={props.position}
      type="LIST"
    >
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              margin: "0px 10px 0px 0px",
              ...provided.draggableProps.style,
            }}
            className="issue-list"
          >
            <div
              key={"list-name-wrapper"}
              className="list-name-wrapper"
              onClick={() => changeTitle(true)}
            >
              {editTitle ? (
                <TextAreaAuto
                  ref={myRef}
                  autoFocus
                  className="list-name"
                  onKeyDown={(e) => {
                    handleKeyDown(e);
                  }}
                  onBlur={sendUpdateList}
                  value={listName}
                  spellCheck={false}
                  onChange={(e) => setListName(e.target.value)}
                />
              ) : (
                <h3 className="list-name">{listName}</h3>
              )}
              <button onClick={removeList}>
                <FontAwesomeIcon icon={faX} />
              </button>
            </div>

            <div className="list-of-issues-wrapper">
              <Droppable
                type="ISSUE"
                droppableId={props.position.toString()}
                key={props.position}
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="list-of-issues"
                    >
                      {props.issues.map((issue, index) => {
                        return (
                          <IssueListItem
                            key={issue.id}
                            position={index}
                            contents={issue}
                            remove={() => removeIssue(issue.id, index)}
                            update={(newIssue) => props.updateIssue(newIssue)}
                          />
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>

            <Popup
              trigger={
                <button className="new-issue-button" onClick={launchIssuePopup}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              }
            >
              <IssuePopup
                position={() => {
                  return props.issues.length;
                }}
                listid={props.listid}
                onCreated={(issue) => {
                  addIssue(issue);
                }}
                show={issuePopupShow}
                onHide={() => {
                  setIssuePopupShow(false);
                }}
              />
            </Popup>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
}

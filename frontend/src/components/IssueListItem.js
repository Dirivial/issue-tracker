import { useState } from "react";

import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import IssuePopup from "./IssuePopup.js";
import "./IssueListItem.css";

export default function IssueListItem({ contents, position, remove, update }) {
  const [issuePopupShow, setIssuePopupShow] = useState(false);

  const [issue, setIssue] = useState({
    name: contents.name,
    id: contents.id,
    position: position,
    description: contents.description,
    done: contents.done,
    due: contents.due,
    listid: contents.listid,
  });

  const removeIssue = () => {
    remove(position);
  };

  const openModal = () => {
    setIssuePopupShow(true);
  };

  const closeModal = () => {
    setIssuePopupShow(false);
  };

  const updateIssue = (updatedIssue) => {
    setIssue(updatedIssue);
    setIssuePopupShow(false);
    update(updatedIssue);
  };

  return (
    <div onClick={null}>
      <Draggable
        key={issue.id}
        draggableId={"Issue" + issue.id}
        index={position}
        type="ISSUE"
      >
        {(provided, snapshot) => {
          return (
            <div
              className="issueListItem"
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={{
                ...provided.draggableProps.style,
              }}
              onClick={() => openModal()}
            >
              <h4
                className={issue.done ? "issueName issueNameDone" : "issueName"}
              >
                {issue.done ? <s>{issue.name}</s> : issue.name}
              </h4>
              <button onClick={removeIssue}>
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
              {provided.placeholder}
            </div>
          );
        }}
      </Draggable>
      <IssuePopup
        issue={() => issue}
        updateIssue={(updatedIssue) => updateIssue(updatedIssue)}
        show={issuePopupShow}
        onHide={closeModal}
      />
    </div>
  );
}

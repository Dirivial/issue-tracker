import { useState, useEffect, useRef } from "react";

import DateTimePicker from "react-datetime-picker";

// Description stuff
import TextAreaAuto from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import RemarkGFM from "remark-gfm";
import ButtonCheckbox from "./ButtonCheckbox.js";

import useAxiosPrivate from "../hooks/useAxiosPrivate.js";

import "./IssuePopup.css";
import "./Tablestyling.css";
import "./calendarStyling.css";

export default function IssuePopup({
  issue,
  updateIssue,
  position,
  listid,
  onCreated,
  show,
  onHide,
}) {
  const [name, setName] = useState(issue ? issue().name : "");
  const [description, setDescription] = useState(
    issue ? issue().description : ""
  );
  const [done, setDone] = useState(issue ? issue().done : false);
  const [dueDate, setDueDate] = useState(issue ? new Date(issue().due) : null);
  const [renderMarkdown, setRenderMarkdown] = useState(true);
  const textAreaRef = useRef();
  const axiosPrivate = useAxiosPrivate();

  const create = async () => {
    try {
      let myIssue = {
        name: name,
        description: description,
        position: position(),
        listid: listid,
        done: done,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
      const response = await axiosPrivate.post("/issue/create", myIssue);

      myIssue.id = response.data.id;
      onCreated(myIssue);
      onHide();
      setName("");
      setDescription("");
      setDone("");
      setRenderMarkdown(true);
    } catch (err) {
      console.log(err);
      //navigate('/login', { state: { from: location }, replace: true });
    }
  };

  const update = async () => {
    try {
      let myIssue = {
        name: name,
        description: description,
        position: issue().position,
        listid: issue().listid,
        issueid: issue().id,
        done: done,
        dueDate: dueDate ? dueDate.toISOString() : null,
      };
      await axiosPrivate.post("/issue/update", myIssue);

      myIssue.id = myIssue.issueid;
      delete myIssue.issueid;
      updateIssue(myIssue);
    } catch (err) {
      console.log(err);
      //navigate('/login', { state: { from: location }, replace: true });
    }
  };

  // Create custom ul aswell which counts the amount of "minitasks"
  // The custom list items to use for the rendered markdown, this allows for buttons instead of checkboxes
  const customListItem = (props) => {
    if (props.checked !== null) {
      return (
        <li className="task-list-item">
          <ButtonCheckbox
            onClick={() =>
              editMarkdownCheckbox(
                props.sourcePosition.start.line - 1,
                props.checked
              )
            }
            isChecked={props.checked}
            className="mycheckbox"
          />
          {props.children.filter((_, index) => index > 0)}
        </li>
      );
    }
    return <li {...props} />;
  };

  // Finds where the checkbox should be in the description and replaces it with the "opposite" (true -> false, false -> true)
  const editMarkdownCheckbox = (lineNumber, checked) => {
    let newDescription = description.split("\n");
    if (checked) {
      newDescription[lineNumber] = newDescription[lineNumber].replace(
        "* [x]",
        "* [ ]"
      );
    } else {
      newDescription[lineNumber] = newDescription[lineNumber].replace(
        "* [ ]",
        "* [x]"
      );
    }
    newDescription = newDescription.map((line) => line + "\n");
    setDescription(String.prototype.concat(...newDescription));
  };

  const editOrSave = () => {
    if (renderMarkdown) {
      setRenderMarkdown(false);
    } else {
      setRenderMarkdown(true);
    }
  };

  useEffect(() => {
    if (!renderMarkdown) textAreaRef.current.focus();
  }, [renderMarkdown]);

  return (
    <div className="NewIssuePopup">
      <div
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        size="xl"
        centered
        backdrop="static"
        contentClassName="normalBackground"
      >
        <div className="modalHeader normalBackground">
          <h2 className="issueHeader">{issue ? "Edit Issue" : "New Issue"}</h2>
        </div>
        <div className="normalBackground modalBody">
          <div className="specialModalGroup">
            <div className="modalBodyGroup issueNameForm">
              <h4 className="">Name</h4>
              <input
                type="text"
                className="modalInput"
                value={name}
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="modalBodyGroup">
              <h4>Done</h4>
              <ButtonCheckbox
                isChecked={done}
                onClick={() => {
                  setDone((prev) => !prev);
                }}
              />
            </div>
          </div>
          <div className="modalBodyGroup">
            <h4>Due</h4>
            <DateTimePicker
              //className="gamer"
              calendarClassName="gamer"
              format="yyyy-MM-dd hh:mm"
              value={dueDate}
              onChange={setDueDate}
            />
          </div>
          <br />
          <div className="modalBodyGroup">
            <h4 className="">Description </h4>
            {renderMarkdown ? (
              <div className="markdownWrapper markdownArea">
                <ReactMarkdown
                  className="renderedMarkdown"
                  children={description}
                  rawSourcePos={true}
                  components={{
                    li: customListItem,
                  }}
                  remarkPlugins={[RemarkGFM]}
                />
              </div>
            ) : (
              <TextAreaAuto
                ref={textAreaRef}
                className="modalTextArea markdownArea"
                value={description}
                placeholder="Description"
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            )}
            <br />
            <button onClick={editOrSave} className="saveButton">
              {renderMarkdown ? "Edit" : "Save Changes"}
            </button>
          </div>
        </div>
        <div bsPrefix="normalBackground customFoot">
          <button onClick={onHide} className="closeButton">
            Close
          </button>
          <button
            onClick={() => {
              issue ? update() : create();
            }}
            className="saveButton"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

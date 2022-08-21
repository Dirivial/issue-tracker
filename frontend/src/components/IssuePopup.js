import { useState, useEffect, useRef } from "react";

import DateTimePicker from "react-datetime-picker";

// Description stuff
import TextAreaAuto from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import RemarkGFM from "remark-gfm";
import ButtonCheckbox from "./ButtonCheckbox.js";

import Modal from "./Modal.js";
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
  close,
}) {
  const [name, setName] = useState(issue ? issue().name : "");
  const [description, setDescription] = useState(
    issue ? issue().description : ""
  );
  const [done, setDone] = useState(issue ? issue().done : false);
  const [due, setDue] = useState(
    issue ? (issue().due ? new Date(issue().due) : null) : null
  );
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
        due: due ? due.toISOString() : null,
      };
      const response = await axiosPrivate.post("/issue/create", myIssue);

      myIssue.id = response.data.id;
      onCreated(myIssue);
      close();
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
        due: due ? due.toISOString() : null,
      };
      await axiosPrivate.post("/issue/update", myIssue);

      myIssue.id = myIssue.issueid;
      delete myIssue.issueid;
      updateIssue(myIssue);
      close();
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
        /[\-\*] \[[x]\]/,
        "* [ ]"
      );
    } else {
      newDescription[lineNumber] = newDescription[lineNumber].replace(
        /[\-\*] \[[\s]\]/,
        "* [x]"
      );
    }
    newDescription = newDescription.map((line, index) => {
      if (index < newDescription.length - 1) return line + "\n";
      return line;
    });
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
    <Modal
      header={issue ? "Edit Issue" : "New Issue"}
      onClose={close}
      onSubmit={() => {
        issue ? update() : create();
      }}
      render={() => {
        return (
          <div className="modalBody">
            <div className="modalBodyGroup">
              <h4 className="modalLabel">Name</h4>
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
              <h4 className="modalLabel">Done</h4>
              <ButtonCheckbox
                isChecked={done}
                onClick={() => {
                  setDone((prev) => !prev);
                }}
              />
            </div>
            <div className="modalBodyGroup">
              <h4>Due</h4>
              <DateTimePicker
                //className="gamer"
                calendarClassName="gamer"
                format="yyyy-MM-dd hh:mm"
                value={due}
                onChange={setDue}
              />
            </div>
            <br />
            <div className="modalBodyGroup">
              <h4 className="modalLabel">Description </h4>
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
        );
      }}
    />
  );
}

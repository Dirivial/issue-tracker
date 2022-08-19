import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import TextAreaAuto from "react-textarea-autosize";
import ReactMarkdown from "react-markdown";
import RemarkGFM from "remark-gfm";

import ButtonCheckbox from "./ButtonCheckbox.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import "./IssuePopup.css";
import "./Tablestyling.css";

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
        issueid: issue().issueid,
        done: done,
      };
      await axiosPrivate.post("/issue/update", myIssue);

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
      <Modal
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
        centered
        backdrop="static"
        contentClassName="normalBackground"
      >
        <div className="modalHeader normalBackground">
          <h2 className="issueHeader">{issue ? "Edit Issue" : "New Issue"}</h2>
        </div>
        <Modal.Body className="normalBackground modalBody">
          <div className="specialModalGroup">
            <div className="modalBodyGroup issueNameForm">
              <Form.Label className="">Name</Form.Label>
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
              <Form.Label>Done</Form.Label>
              <ButtonCheckbox
                isChecked={done}
                onClick={() => {
                  setDone((prev) => !prev);
                }}
              />
            </div>
          </div>

          <br />
          <div className="modalBodyGroup">
            <Form.Label className="">Description </Form.Label>
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
            <button onClick={editOrSave} className="saveButton">
              {renderMarkdown ? "Edit" : "Save Changes"}
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer bsPrefix="normalBackground customFoot">
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
        </Modal.Footer>
      </Modal>
    </div>
  );
}

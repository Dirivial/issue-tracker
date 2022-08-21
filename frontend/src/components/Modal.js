import "./Modal.css";

export default function Modal({
  onSubmit,
  onClose,
  header,
  closeText,
  submitText,
  render,
}) {
  return (
    <div>
      <div className="modal">
        <h2 className="modalHeader">{header ? header : "Header"}</h2>
        <div className="newContainerBody">{render()}</div>
        <div className="newContainerFooter">
          <button className="closeButton" onClick={onClose}>
            {closeText ? closeText : "Close"}
          </button>
          <button className="saveButton" onClick={onSubmit}>
            {submitText ? submitText : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

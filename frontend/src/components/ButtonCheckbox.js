import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./ButtonCheckbox.css";

export default function ButtonCheckbox({ isChecked, onClick }) {
  const [checked, setChecked] = useState(isChecked);

  const buttonClicked = () => {
    setChecked((prev) => !prev);
    if (onClick) onClick();
  };

  return (
    <button
      className={
        checked
          ? "checkedButton buttonCheckbox"
          : "uncheckedButton buttonCheckbox"
      }
      onClick={buttonClicked}
    >
      {checked ? (
        <FontAwesomeIcon className="checkedIcon" icon={faCheck} />
      ) : null}
    </button>
  );
}

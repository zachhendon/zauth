import { useState } from "react";
import "./EditList.css";

export default function EditList(props) {
  const [value, setValue] = useState(props.title);
  const [disabled, setDisabled] = useState(props.title === "");

  function handleKeyDown(event) {
    if (event.key === "Enter" && !disabled) {
      props.handleSubmit(value.trim());
    }
    if (event.key === "Escape") {
      props.handleCancel();
    }
  }

  function handleChange(event) {
    setValue(event.target.value);
    setDisabled(event.target.value === "");
  }

  return (
    <div className="edit-list">
      <input
        className="edit-list-input"
        type="text"
        placeholder="Name of list"
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        value={value}
        autoFocus
      />
      <div className="edit-list-buttons">
        <button
          className="delete-button"
          onClick={props.handleSubmit}
          disabled={disabled}
        >
          <p>Save</p>
        </button>
        <button className="cancel-button" onClick={props.handleCancel}>
          <p>Cancel</p>
        </button>
      </div>
    </div>
  );
}

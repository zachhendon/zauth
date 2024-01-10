import "./EditTask.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function EditTask(props) {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);
  const today = new Date().toISOString().split("T")[0];
  const [due, setDue] = useState(props.task.due || today);
  const lists = useSelector((state) => state.tasks.lists);
  const list = lists.find((list) => list.id === props.listId);
  const [disabled, setDisabled] = useState(true);

  function handleSave() {
    const newTask = {
      listId: list.id,
      task: {
        ...props.task,
        title: title.trim(),
        description: description.trim(),
        due: due,
      },
    };
    setTitle("");
    setDescription("");
    setDue(today);
    document.querySelector(".edit-list-title-input").focus();
    props.handleSave(newTask);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !disabled) {
      handleSave();
    }
    if (e.key === "Escape") {
      props.handleCancel();
    }
  }

  function handleListChange(e) {
    const list = lists.find((list) => list.id == e.target.value);
    setList(list);
  }

  useEffect(() => {
    console.log(description);
    setDisabled(
      title === "" || title == undefined || due === "" || due == undefined
    );
  }, [title, description, due]);

  return (
    <div className="edit-task" onKeyDown={handleKeyDown}>
      <div className="task-desc">
        <input
          className="edit-list-title-input"
          type="text"
          placeholder="Task name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <input
          className="edit-list-desc-input"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="edit-task-options">
        <div className="due-list">
          <input
            className="edit-list-due-input"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </div>
        <div className="edit-task-buttons">
          <button className="cancel-button" onClick={props.handleCancel}>
            <p>Cancel</p>
          </button>
          <button
            className="delete-button"
            onClick={handleSave}
            disabled={disabled}
          >
            <p>Save</p>
          </button>
        </div>
      </div>
    </div>
  );
}

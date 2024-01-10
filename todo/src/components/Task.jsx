import "./Task.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  editTask,
  toggleTask,
  toggleTaskEdit,
} from "../features/tasks/tasksSlice";
import EditTask from "./EditTask";

export default function Task(props) {
  const [hovering, setHovering] = useState();
  const [clicked, setClicked] = useState();
  const dispatch = useDispatch();

  function handleClick() {
    setClicked(true);
    setTimeout(() => {
      dispatch(toggleTask({ listId: props.listId, taskId: props.task.id }));
    }, 300);
  }

  function handleSaveProp(newTask) {
    if (newTask.listId !== props.listId) {
      alert("List changed");
      return;
    }
    dispatch(
      editTask({
        listId: props.listId,
        taskId: props.task.id,
        newTask: {
          ...newTask.task,
          edit: false,
        },
      })
    );
  }

  function handleCancelProp() {
    dispatch(toggleTaskEdit({ listId: props.listId, taskId: props.task.id }));
  }

  useEffect(() => {
    setClicked(props.task.completed);
    setHovering(props.task.completed);
  }, [props.task.completed]);

  if (props.task.completed) {
    return;
  }

  if (props.task.edit) {
    return (
      <EditTask
        task={props.task}
        listId={props.listId}
        handleSave={handleSaveProp}
        handleCancel={handleCancelProp}
      />
    );
  }

  return (
    <div className="task">
      <div
        className="task-checkbox"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={handleClick}
      >
        {!hovering && !clicked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
        {(hovering || clicked) && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={clicked ? "clicked" : ""}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        )}
      </div>
      <p
        onClick={() =>
          dispatch(
            toggleTaskEdit({ listId: props.listId, taskId: props.task.id })
          )
        }
      >
        {props.task.title}
      </p>
    </div>
  );
}

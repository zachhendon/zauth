import "./List.css";
import Task from "./Task";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import {
  deleteListDb,
  editListDb,
  toggleListEdit,
  addTaskDb,
} from "../features/tasksSlice";
import EditList from "./EditList";
import TrashIcon from "../assets/trash.svg";
import ChevronDownIcon from "../assets/chevron-down.svg";
import ChevronRightIcon from "../assets/chevron-right.svg";
import PlusIcon from "../assets/plus.svg";
import EditTask from "./EditTask";

export default function List(props) {
  const dispatch = useDispatch();
  const [collapsed, setCollapsed] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const deleteDialog = useRef();
  const emptyTask = {
    name: "",
    description: "",
    due: "",
    edit: false,
    completed: false,
  };

  function handleEdit() {
    dispatch(toggleListEdit(props.list.id));
  }

  function handleDelete() {
    deleteDialog.current.showModal();
  }
  function confirmDelete() {
    dispatch(deleteListDb(props.list.id));
    deleteDialog.current.close();
  }
  function cancelDelete() {
    deleteDialog.current.close();
  }
  useEffect(() => {
    const handleClick = (event) => {
      if (event.target === deleteDialog.current) {
        cancelDelete();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        cancelDelete();
      }
      if (event.key === "Enter") {
        confirmDelete();
      }
    };

    deleteDialog.current.addEventListener("click", handleClick);
    deleteDialog.current.addEventListener("keydown", handleKeyDown);

    return () => {
      if (!deleteDialog.current) return;
      deleteDialog.current.removeEventListener("click", handleClick);
      deleteDialog.current.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleSubmitProp(name) {
    if (name === "") {
      return;
    }
    dispatch(editListDb({ listId: props.list.id, name }));
    dispatch(toggleListEdit(props.list.id));
  }

  function handleCancelProp() {
    dispatch(toggleListEdit(props.list.id));
  }

  function handleTaskSaveProp(newTask) {
    const { name, description, due } = newTask;
    dispatch(addTaskDb({ listId: props.list.id, name, description, due }));
  }

  function handleTaskCancelProp() {
    setAddingTask(false);
  }

  return (
    <div
      className="list"
      style={{ display: props.list.deleting ? "none" : "flex" }}
    >
      {!props.list.edit && (
        <img
          src={collapsed ? ChevronRightIcon : ChevronDownIcon}
          alt="chevron-down"
          className="chevron"
          onClick={() => setCollapsed(!collapsed)}
        />
      )}
      <div className="list-content">
        <div className="list-header">
          {props.list.edit ? (
            <EditList
              name={props.list.name}
              handleSubmit={handleSubmitProp}
              handleCancel={handleCancelProp}
            />
          ) : (
            <>
              <h4 onClick={handleEdit}>{props.list.name}</h4>
              <img
                src={TrashIcon}
                alt="trash"
                className="trash-icon"
                onClick={handleDelete}
              />
            </>
          )}
        </div>
        {!collapsed && (
          <>
            <div className="list-tasks">
              {props.list.tasks.map((task) => (
                <React.Fragment key={task.id}>
                  <Task task={task} listId={props.list.id} />
                </React.Fragment>
              ))}
            </div>
            {!addingTask ? (
              <div
                className="add-task-button"
                onClick={() => setAddingTask(true)}
              >
                <img src={PlusIcon} alt="plus" className="add-task-icon" />
                <p>Add Task</p>
              </div>
            ) : (
              <EditTask
                task={emptyTask}
                listId={props.list.id}
                handleSave={handleTaskSaveProp}
                handleCancel={handleTaskCancelProp}
              />
            )}
          </>
        )}
        <dialog className="delete-dialog" ref={deleteDialog}>
          <div className="delete-dialog-div">
            <p className="message">
              Are you sure you want to delete <b>{props.list.name}</b>?
            </p>
            <div className="delete-dialog-buttons">
              <button onClick={cancelDelete} className="cancel-button">
                <p>Cancel</p>
              </button>
              <button onClick={confirmDelete} className="delete-button">
                <p>Delete</p>
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
}

import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import List from "./components/List";
import {
  addListDb,
  clearUndo,
  fetchUserData,
} from "./features/tasksSlice";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import EditList from "./components/EditList";
import PlusIcon from "./assets/plus.svg";
import XMarkIcon from "./assets/x-mark.svg";
import Header from "./layouts/Header/Header.jsx"

function App() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [addingList, setAddingList] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  function handleUndo() {
    const task = tasks.taskHistory[tasks.taskHistory.length - 1];
    dispatch(toggleTask({ listId: task.listId, taskId: task.taskId }));
  }

  function handleSubmitProp(name) {
    dispatch(addListDb(name));
    setAddingList(false);
  }

  function handleCancelProp() {
    setAddingList(false);
  }

  const lists = tasks.lists.map((list) => (
    <React.Fragment key={list.id}>
      <List list={list} />
    </React.Fragment>
  ));

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      dispatch(clearUndo());
    }, 10000);
  }, [tasks.taskHistory]);

  return (
    <div id="App">
      <Header />
      <main className="content">
        {lists}
        <div className="test">
          {addingList ? (
            <EditList
              name=""
              handleSubmit={handleSubmitProp}
              handleCancel={handleCancelProp}
            />
          ) : (
            <div
              className="add-list-button"
              onClick={() => setAddingList(true)}
            >
              <img src={PlusIcon} alt="plus" className="add-list-icon" />
              <h4>Add List</h4>
            </div>
          )}
          {tasks.undo && (
            <div className="popup">
              <p>Task completed</p>
              <p className="undo" onClick={handleUndo}>
                Undo
              </p>
              <img
                src={XMarkIcon}
                alt="x"
                onClick={() => dispatch(clearUndo())}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

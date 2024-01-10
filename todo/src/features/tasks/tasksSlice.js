import { createSlice } from "@reduxjs/toolkit";

function getListId(state) {
  return state.lists.reduce((maxId, list) => Math.max(list.id, maxId), -1) + 1;
}

function getTaskId(list) {
  return list.tasks.reduce((maxId, task) => Math.max(task.id, maxId), -1) + 1;
}

const initialState = {
  undo: false,
  taskHistory: [],
  lists: [],
};

export const tasksSlice = createSlice({
  initialState,
  name: "tasks",
  reducers: {
    addList: (state, action) => {
      const id = getListId(state);
      state.lists.push({ id, ...action.payload });
    },
    deleteList: (state, action) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
    editListName: (state, action) => {
      const list = state.lists.find((list) => list.id === action.payload.id);
      list.title = action.payload.title;
    },
    toggleListEdit(state, action) {
      const list = state.lists.find((list) => list.id === action.payload);
      list.edit = !list.edit;
    },
    addTask: (state, action) => {
      const { listId, task } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      const id = getTaskId(list);
      list.tasks.push({ id, ...task });
    },
    deleteTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      list.tasks = list.tasks.filter((task) => task.id !== taskId);
    },
    editTask: (state, action) => {
      console.log(action.payload);
      const { listId, taskId, newTask } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      const task = list.tasks.find((task) => task.id === taskId);
      task.title = newTask.title;
      console.log(newTask.title);
      task.description = newTask.description;
      task.due = newTask.due;
      task.edit = newTask.edit;
    },
    toggleTaskEdit: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      const task = list.tasks.find((task) => task.id === taskId);
      task.edit = !task.edit;
    },
    toggleTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      const task = list.tasks.find((task) => task.id === taskId);
      task.completed = !task.completed;
      console.log(task.completed);
      if (task.completed) {
        state.undo = true;
        state.taskHistory.push({ listId, taskId });
      } else {
        state.undo = false;
        state.taskHistory = state.taskHistory.filter((task) => {
          task.taskId !== taskId && task.listId !== listId;
        });
      }
    },
    clearUndo: (state) => {
      state.undo = false;
    },
  },
});

export const {
  addList,
  deleteList,
  editListName,
  toggleListEdit,
  addTask,
  deleteTask,
  editTask,
  toggleTaskEdit,
  toggleTask,
  clearUndo,
} = tasksSlice.actions;
export default tasksSlice.reducer;

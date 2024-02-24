import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

function getListId(state) {
  return (
    state.tasks.lists.reduce((maxId, list) => Math.max(list.id, maxId), -1) + 1
  );
}

function getTaskId(list) {
  return list.tasks.reduce((maxId, task) => Math.max(task.id, maxId), -1) + 1;
}

const initialState = {
  undo: false,
  taskHistory: [],
  lists: [],
};

const user_id = 1;

export const fetchUserData = createAsyncThunk("tasks/fetchLists", async () => {
  const lists = await axios.get(`http://localhost:9000/list/${user_id}`);
  const listsDeleting = lists.data.map((list) => ({
    ...list,
    deleting: false,
  }));
  const sortedLists = listsDeleting.sort((a, b) => a.id - b.id);
  const tasks = await axios.all(
    sortedLists.map((list) =>
      axios.get(`http://localhost:9000/task/${user_id}/${list.id}`)
    )
  );
  const sortedTasks = tasks.map((task) =>
    task.data.sort((a, b) => a.id - b.id)
  );
  return { lists: sortedLists, tasks: sortedTasks };
});

export const addListDb = createAsyncThunk(
  "tasks/addListDb",
  async (name, { dispatch, getState }) => {
    const state = getState();
    const listId = getListId(state);
    dispatch(tasksSlice.actions.addList({ id: listId, name }));
    try {
      await axios.post(`http://localhost:9000/list/${user_id}`, {
        name,
      });
      dispatch(fetchUserData());
    } catch (err) {
      dispatch(tasksSlice.actions.deleteList(listId));
      throw err;
    }
  }
);

export const deleteListDb = createAsyncThunk(
  "tasks/deleteListDb",
  async (listId, { dispatch }) => {
    dispatch(tasksSlice.actions.toggleDeleting(listId));
    try {
      await axios.delete(`http://localhost:9000/list/${user_id}/${listId}`);
      dispatch(fetchUserData());
    } catch (err) {
      dispatch(tasksSlice.actions.toggleDeleting(listId));
      throw err;
    }
  }
);

export const editListDb = createAsyncThunk(
  "tasks/editListDb",
  async ({ listId, name }, { dispatch, getState }) => {
    const state = getState();
    const originalName = state.tasks.lists.find(
      (list) => list.id === listId
    ).name;
    dispatch(tasksSlice.actions.editList({ listId, name }));
    try {
      await axios.put(`http://localhost:9000/list/${user_id}/${listId}`, {
        name,
      });
      dispatch(fetchUserData());
    } catch (err) {
      dispatch(tasksSlice.actions.editList({ listId, name: originalName }));
      throw err;
    }
  }
);

export const addTaskDb = createAsyncThunk(
  "tasks/addTaskDb",
  async ({ listId, name, description, due }, { dispatch, getState }) => {
    const state = getState();
    const list = state.tasks.lists.find((list) => list.id === listId);
    const id = getTaskId(list);
    dispatch(tasksSlice.actions.addTask({ id, listId, name, description }));
    try {
      await axios.post(`http://localhost:9000/task/${user_id}/${listId}`, {
        name,
        description,
        due,
      });
      dispatch(fetchUserData());
    } catch (err) {
      dispatch(tasksSlice.actions.deleteTask({ listId, taskId: id }));
      throw err;
    }
  }
);

export const deleteTaskDb = createAsyncThunk(
  "tasks/deleteTaskDb",
  async ({ listId, taskId }, { dispatch, getState }) => {
    const state = getState();
    const list = state.tasks.lists.find((list) => list.id === listId);
    const task = list.tasks.find((task) => task.id === taskId);
    dispatch(tasksSlice.actions.deleteTask({ listId, taskId }));
    try {
      await axios.delete(`http://localhost:9000/task/${user_id}/${taskId}`);
      dispatch(fetchUserData());
    } catch (err) {
      console.log("adding back...");
      dispatch(
        tasksSlice.actions.addTask({
          id: taskId,
          listId,
          name: task.name,
          description: task.description,
        })
      );
      throw err;
    }
  }
);

export const editTaskDb = createAsyncThunk(
  "tasks/editTaskDb",
  async ({ listId, taskId, newTask }, { dispatch, getState }) => {
    const state = getState();
    const originalTask = state.tasks.lists
      .find((list) => list.id === listId)
      .tasks.find((task) => task.id === taskId);
    const { name, description, due, completed } = newTask;
    dispatch(tasksSlice.actions.editTask({ listId, taskId, newTask }));
    try {
      // TODO: add due date
      await axios.put(`http://localhost:9000/task/${user_id}/${taskId}`, {
        name,
        description,
        completed,
      });
      dispatch(fetchUserData());
    } catch (err) {
      dispatch(
        tasksSlice.actions.editTask({
          listId,
          taskId,
          newTask: { ...originalTask, edit: false },
        })
      );
      throw err;
    }
  }
);

export const toggleTaskDb = createAsyncThunk(
  "tasks/toggleTask",
  async ({ listId, taskId }, { dispatch, getState }) => {
    const state = getState();
    const list = state.tasks.lists.find((list) => list.id === listId);
    const task = list.tasks.find((task) => task.id === taskId);
    try {
      await axios({
        method: "put",
        url: `http://localhost:9000/task/${user_id}/${taskId}`,
        data: { completed: task.completed == 0 ? 1 : 0 },
      });
      dispatch(tasksSlice.actions.toggleTask({ listId, taskId }));
    } catch (err) {
      throw err;
    }
  }
);

export const tasksSlice = createSlice({
  initialState,
  name: "tasks",
  reducers: {
    addList: (state, action) => {
      state.lists.push({
        ...action.payload,
        user_id,
        tasks: [],
        deleting: false,
      });
    },
    toggleDeleting: (state, action) => {
      const list = state.lists.find((list) => list.id === action.payload);
      list.deleting = !list.deleting;
    },
    deleteList: (state, action) => {
      const listId = action.payload;
      state.lists = state.lists.filter((list) => list.id !== listId);
    },
    editList: (state, action) => {
      const { listId, name } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      list.name = name;
    },
    toggleListEdit(state, action) {
      const list = state.lists.find((list) => list.id === action.payload);
      list.edit = !list.edit;
    },
    addTask: (state, action) => {
      console.log(action.payload);
      const { id, listId, name, description } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      list.tasks = list.tasks
        .concat({ id, name, description, completed: 0 })
        .sort((a, b) => a.id - b.id);
      // list.tasks.push({ id, name, description, completed: 0, edit: false });
    },
    deleteTask: (state, action) => {
      const { listId, taskId } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      list.tasks = list.tasks.filter((task) => task.id !== taskId);
    },
    editTask: (state, action) => {
      const { listId, taskId, newTask } = action.payload;
      const list = state.lists.find((list) => list.id === listId);
      const task = list.tasks.find((task) => task.id === taskId);
      task.name = newTask.name;
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
      if (task.completed == 0) {
        task.completed = 1;
        state.undo = false;
        state.taskHistory = state.taskHistory.filter((task) => {
          task.taskId !== taskId;
        });
      } else {
        task.completed = 0;
        state.undo = false;
        state.taskHistory.push({ listId, taskId });
      }
    },
    clearUndo: (state) => {
      state.undo = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      const { lists, tasks } = action.payload;
      const listsWithTasks = lists.map((list, index) => {
        list.tasks = tasks[index];
        return list;
      });
      const listsWithTasksSorted = listsWithTasks.sort((a, b) => a.id - b.id);
      state.lists = listsWithTasksSorted;
    });
  },
});

export const {
  toggleListEdit,
  toggleTaskEdit,
  clearUndo,
} = tasksSlice.actions;
export default tasksSlice.reducer;

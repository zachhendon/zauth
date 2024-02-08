import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/tasksSlice";

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      ...preloadedState,
    },
  });
};
export const store = setupStore();

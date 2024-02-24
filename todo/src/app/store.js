import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasksSlice";
import userReducer from "../features/userSlice"

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
      user: userReducer,
      ...preloadedState,
    },
  });
};
export const store = setupStore();

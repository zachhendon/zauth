import { configureStore } from "@reduxjs/toolkit";
// import responseReducer from "../features/response/responseSlice";
import tasksReducer from "../features/tasks/tasksSlice";

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: {
      // response: responseReducer,
      tasks: tasksReducer,
      ...preloadedState,
    },
  });
};
export const store = setupStore();

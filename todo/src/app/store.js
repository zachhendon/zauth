import { configureStore } from "@reduxjs/toolkit";
import responseReducer from "../features/response/responseSlice";

export const setupStore = preloadedState => {
  return configureStore({
    reducer: {
      response: responseReducer,
      ...preloadedState,
    },
  });
};
export const store = setupStore();

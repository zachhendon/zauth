import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  access: {},
};

export const userSlice = createSlice({
  initialState,
  name: "user",
  reducers: {
    login: (state, action) => {},
    logout: (state, action) => {},
  },
});

export const {
  login,
  logout,
} = userSlice.actions;
export default userSlice.reducer;

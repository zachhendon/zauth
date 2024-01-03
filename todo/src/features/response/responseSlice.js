import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    apiResponse: 'abcd',
}

export const responseSlice = createSlice({
    name: 'response',
    initialState,
    reducers: {
        setResponse: (state, action) => {
            state.apiResponse = action.payload;
        },
    },
});

export const { setResponse } = responseSlice.actions;
export default responseSlice.reducer;
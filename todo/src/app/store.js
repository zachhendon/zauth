import { configureStore } from '@reduxjs/toolkit';
import responseReducer from '../features/response/responseSlice';

export const store = configureStore({
    reducer: {
        response: responseReducer,
    },
});
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';

export const store = configureStore({
    reducer: {
        profile: profileReducer,
        // Sau này có thể thêm authReducer, cartReducer,...
    },
});

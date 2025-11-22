import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import billboardReducer from './slices/billboardSlice';

import bookingReducer from './slices/bookingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        billboard: billboardReducer,
        booking: bookingReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

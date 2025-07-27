// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './slices/profileSlice';
import followReducer from './slices/followSlice';
import messageReducer from './slices/messageSlice';
import notificationReducer from './slices/notificationSlice';
import feedReducer from './slices/feedSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    follow: followReducer,
    message: messageReducer,
    notification: notificationReducer,
    feed: feedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
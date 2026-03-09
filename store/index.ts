import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import tourReducer from './slices/tourSlice';
import organizationReducer from './slices/organizationSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import notificationReducer from './slices/notificationSlice';
import languageReducer from './slices/languageSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language', 'tour'], // Only persist language and tour state
};

const persistedTourReducer = persistReducer(persistConfig, tourReducer);
const persistedLanguageReducer = persistReducer(persistConfig, languageReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tour: persistedTourReducer,
    organization: organizationReducer,
    subscription: subscriptionReducer,
    notification: notificationReducer,
    language: persistedLanguageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

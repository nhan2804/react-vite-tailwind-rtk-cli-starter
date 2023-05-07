import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@modules/auth/slices";
import darkModeReducer from "@app/slices/darkMode";
// import chatReducer from "@modules/firebase/slices";
// import friendReducer from "@modules/firebase/slices/friend";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "sso-app",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  dark: darkModeReducer,
  // chat: chatReducer,
  // friend: friendReducer,
});

const persistedReducer = persistReducer({ ...persistConfig }, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

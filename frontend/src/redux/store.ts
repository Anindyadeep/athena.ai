import { configureStore } from "@reduxjs/toolkit";
import storyBookReducer from "./slice/storyBook";
import audioReducer from "./slice/audio";
import quizReducer from "./slice/quiz";
import mindMapReducer from "./slice/mindMap";

import { combineReducers } from "@reduxjs/toolkit";

import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  storyBook: storyBookReducer,
  audio: audioReducer,
  quiz: quizReducer,
  mindMap: mindMapReducer,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

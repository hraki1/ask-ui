import { configureStore } from "@reduxjs/toolkit";

import postReducer from "./post";
import showModalReducer from "./showModal";
import authReducer from "./auth";
import notificationReducer from "./notification";
import answerReducer from "./answer";

const store = configureStore({
  reducer: {
    posts: postReducer,
    showModal: showModalReducer,
    auth: authReducer,
    notification: notificationReducer,
    answer: answerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

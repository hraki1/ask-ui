import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Notification from "../Model/Notification";

interface NotificationState {
  notifications: Notification[];
  unReadNotification: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
  unReadNotification: [],
};
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addMany: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unReadNotification = action.payload.filter((n) => !n.isRead);
    },
    add: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    updateNotification: (state, action: PayloadAction<Notification>) => {
      state.unReadNotification = state.unReadNotification.filter(
        (n) => n.id !== action.payload.id
      );
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (post) => post.id !== action.payload
      );
      state.unReadNotification = state.notifications.filter((n) => !n.isRead);
    },
  },
});

export const notificationActions = notificationsSlice.actions;
export default notificationsSlice.reducer;

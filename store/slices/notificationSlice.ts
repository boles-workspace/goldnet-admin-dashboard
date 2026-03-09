import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  _id: string;
  userId: string;
  type: 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'SUBSCRIPTION_EXPIRING' | 'SUBSCRIPTION_EXPIRED' | 'PLAN_UPGRADED' | 'PLAN_DOWNGRADED';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  unreadCount: number;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  unreadCount: 0,
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read).length;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
      state.unreadCount = 0;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  setLoading,
  setError,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

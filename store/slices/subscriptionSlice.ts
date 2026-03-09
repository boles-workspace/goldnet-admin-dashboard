import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Subscription {
  _id: string;
  organizationId: string;
  planId: string;
  status: 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  paymentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  _id: string;
  organizationId: string;
  planId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  receiptUrl: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

interface SubscriptionState {
  current: Subscription | null;
  list: Subscription[];
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  current: null,
  list: [],
  payments: [],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.list = action.payload;
    },
    setCurrentSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.current = action.payload;
    },
    setPayments: (state, action: PayloadAction<Payment[]>) => {
      state.payments = action.payload;
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSubscriptions: (state) => {
      state.list = [];
      state.current = null;
      state.payments = [];
    },
  },
});

export const {
  setSubscriptions,
  setCurrentSubscription,
  setPayments,
  updatePayment,
  setLoading,
  setError,
  clearSubscriptions,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  organizationId?: string;
  createdAt: string;
}

export interface UserPreferences {
  tourCompleted: boolean;
  tourCompletedAt?: string;
  tourSkipped: boolean;
  tourVersion: string;
  language: 'en' | 'ar';
}

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      if (state.preferences) {
        state.preferences = { ...state.preferences, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.preferences = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setProfile,
  setPreferences,
  updatePreferences,
  setLoading,
  setError,
  clearUser,
} = userSlice.actions;

export default userSlice.reducer;

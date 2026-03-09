import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TourState {
  isActive: boolean;
  currentStep: number;
  completed: boolean;
  skipped: boolean;
}

const initialState: TourState = {
  isActive: false,
  currentStep: 0,
  completed: false,
  skipped: false,
};

const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    startTour: (state) => {
      state.isActive = true;
      state.currentStep = 0;
      state.completed = false;
      state.skipped = false;
    },
    setTourActive: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    completeTour: (state) => {
      state.isActive = false;
      state.completed = true;
    },
    skipTour: (state) => {
      state.isActive = false;
      state.skipped = true;
    },
    resetTour: (state) => {
      state.currentStep = 0;
      state.completed = false;
      state.skipped = false;
    },
  },
});

export const {
  startTour,
  setTourActive,
  setCurrentStep,
  completeTour,
  skipTour,
  resetTour,
} = tourSlice.actions;

export default tourSlice.reducer;

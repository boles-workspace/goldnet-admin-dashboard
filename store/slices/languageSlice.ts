import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

interface LanguageState {
  current: Language;
  direction: Direction;
}

const initialState: LanguageState = {
  current: 'en',
  direction: 'ltr',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.current = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
    },
    toggleLanguage: (state) => {
      const newLanguage: Language = state.current === 'en' ? 'ar' : 'en';
      state.current = newLanguage;
      state.direction = newLanguage === 'ar' ? 'rtl' : 'ltr';
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;

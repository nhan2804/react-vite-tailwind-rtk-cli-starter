import { createSlice } from "@reduxjs/toolkit";

export interface DarkModeState {
  isDark: Boolean;
}

const initialState: DarkModeState = {
  isDark: false,
};

export const darkModeSlice = createSlice({
  name: "dark",
  initialState,
  reducers: {
    toogleDarkMode: (state, action) => {
      state.isDark = !state.isDark;
    },
    switchLightMode: (state, action) => {
      state.isDark = false;
    },
    switchDarkMode: (state, action) => {
      state.isDark = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const { switchDarkMode, switchLightMode, toogleDarkMode } =
  darkModeSlice.actions;

export default darkModeSlice.reducer;

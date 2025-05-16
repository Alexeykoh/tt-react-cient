import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface state {
  isOpen: boolean;
}

const initialState: state = {
  isOpen: false,
};

const notificationSlice = createSlice({
  name: "notification-sheet",
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload === true ? true : false;
    },
  },
});

export const { toggle } = notificationSlice.actions;

export default notificationSlice.reducer;

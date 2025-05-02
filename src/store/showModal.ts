import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  open: boolean;
}

const initialState: ModalState = {
  open: false,
};

const showModalSlice = createSlice({
  name: "showModal",
  initialState,
  reducers: {
    toggleShowModal: (state) => {
      state.open = !state.open;
    },
  },
});

export const showModalActions = showModalSlice.actions;

export default showModalSlice.reducer;

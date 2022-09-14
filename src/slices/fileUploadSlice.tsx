import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type FileType = {
  preview: string;
};

interface IState {
  file: string[];
}

const initialState: IState = {
  file: [],
};

const uploadFileSlice = createSlice({
  name: "uploadFile",
  initialState,
  reducers: {
    setFile(state, action: PayloadAction<string>) {
      state.file.push(action.payload);
    },
  },
});

export const { setFile } = uploadFileSlice.actions;
export default uploadFileSlice.reducer;

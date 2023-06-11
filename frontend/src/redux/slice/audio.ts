import { createSlice } from "@reduxjs/toolkit";

interface audioState {
  audio: string;
}

const initialState: audioState = {
  audio: "String",
};

const audioSlice = createSlice({
  name: "Audio",
  initialState,
  reducers: {
    addToAudio: (state, action) => {
      state.audio = action.payload;
    },
    removeAudio: (state) => {
      state.audio = "";
    },
  },
});

export const { addToAudio, removeAudio } = audioSlice.actions;
export default audioSlice.reducer;

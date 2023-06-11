import { createSlice } from "@reduxjs/toolkit";

interface mindMapState {
  mindMap: string[];
}

const initialState: mindMapState = {
  mindMap: ["String"],
};

const mindMapSlice = createSlice({
  name: "MindMap",
  initialState,
  reducers: {
    addToMindMap: (state, action) => {
      state.mindMap = action.payload;
    },
    removeMindMap: (state) => {
      state.mindMap = [""];
    },
  },
});

export const { addToMindMap, removeMindMap } = mindMapSlice.actions;
export default mindMapSlice.reducer;

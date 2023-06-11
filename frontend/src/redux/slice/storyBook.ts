import { createSlice } from "@reduxjs/toolkit";

interface storyPage {
  image: string;
  content: string;
}

interface storyBookState {
  storyBook: storyPage[];
}

const initialState: storyBookState = {
  storyBook: [
    {
      image:
        "https://jayfolio-images.s3.ap-south-1.amazonaws.com/public/ts.png",
      content: "Jayanth",
    },
    {
      image:
        "https://jayfolio-images.s3.ap-south-1.amazonaws.com/public/ts.png",
      content: "Jayanth1",
    },
    {
      image:
        "https://jayfolio-images.s3.ap-south-1.amazonaws.com/public/ts.png",
      content: "Jayanth2",
    },
  ],
};

const storyBookSlice = createSlice({
  name: "StoryBook",
  initialState,
  reducers: {
    addToStoryBook: (state, action) => {
      state.storyBook = action.payload;
    },
    removeStoryBook: (state) => {
      state.storyBook = [
        {
          image:
            "https://jayfolio-images.s3.ap-south-1.amazonaws.com/public/ts.png",
          content: "Jayanth",
        },
      ];
    },
  },
});

export const { addToStoryBook, removeStoryBook } = storyBookSlice.actions;
export default storyBookSlice.reducer;

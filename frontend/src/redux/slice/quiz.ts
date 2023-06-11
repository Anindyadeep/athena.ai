import { createSlice } from "@reduxjs/toolkit";

interface options {
  id: number;
  content: string;
}

interface question {
  content: string;
  options: options[];
  answer: number;
}

interface quizState {
  quiz: question[];
}

const initialState: quizState = {
  quiz: [
    {
      content: "Jayanth",
      options: [
        {
          id: 1,
          content: "Jayanth",
        },
        {
          id: 2,
          content: "Jayanth",
        },
        {
          id: 3,
          content: "Jayanth",
        },
        {
          id: 4,
          content: "Jayanth",
        },
      ],
      answer: 1,
    },
    {
      content: "Jayanth",
      options: [
        {
          id: 1,
          content: "Jayanth",
        },
        {
          id: 2,
          content: "Jayanth",
        },
        {
          id: 3,
          content: "Jayanth",
        },
        {
          id: 4,
          content: "Jayanth",
        },
      ],
      answer: 1,
    },
  ],
};

const quizSlice = createSlice({
  name: "Quiz",
  initialState,
  reducers: {
    addToQuiz: (state, action) => {
      state.quiz = action.payload;
    },
    removeQuiz: (state) => {
      state.quiz = [
        {
          content: "Jayanth",
          options: [
            {
              id: 1,
              content: "Jayanth",
            },
            {
              id: 2,
              content: "Jayanth",
            },
            {
              id: 3,
              content: "Jayanth",
            },
            {
              id: 4,
              content: "Jayanth",
            },
          ],
          answer: 1,
        },
      ];
    },
  },
});

export const { removeQuiz } = quizSlice.actions;
export default quizSlice.reducer;

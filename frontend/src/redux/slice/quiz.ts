import { createSlice } from "@reduxjs/toolkit";



interface question {
  question: string;
  options: string[];
  answer: string;
}

interface quizState {
  quiz: question[];
}

const initialState: quizState = {
  quiz: [
    {
      question: "What is the capital of India?",
      options: ["Delhi", "Mumbai", "Kolkata", "Chennai"],
      answer: "Delhi",
    }
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
      ];
    },
  },
});

export const { addToQuiz, removeQuiz } = quizSlice.actions;
export default quizSlice.reducer;

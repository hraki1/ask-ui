import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Answer from "../Model/Answer";

interface AnswerState {
  answers: Answer[];
  userAnswers: Answer[];
}

const initialState: AnswerState = {
  answers: [],
  userAnswers: [],
};
const postSlice = createSlice({
  name: "answers",
  initialState,
  reducers: {
    addMany: (state, action: PayloadAction<Answer[]>) => {
      state.answers = action.payload;
    },
    addManyUserAnswers: (state, action: PayloadAction<Answer[]>) => {
      state.userAnswers = action.payload;
    },
    add: (state, action: PayloadAction<Answer>) => {
      console.log(action.payload);
      state.answers = [action.payload, ...state.answers]; // correct!
    },
    updatePost: (state, action: PayloadAction<Answer>) => {
      const index = state.answers.findIndex(
        (answer) => answer.id === action.payload.id
      );
      console.log(action.payload);
      if (index !== -1) {
        state.answers[index] = action.payload;
      } else {
        console.warn("⚠️ Post with ID not found in state:", action.payload.id);
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.answers = state.answers.filter(
        (answer) => answer.id !== action.payload
      );
    },
  },
});

export const answerActions = postSlice.actions;
export default postSlice.reducer;

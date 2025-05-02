import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Post from "../Model/Post";
import Answer from "../Model/Answer";

interface PostState {
  posts: Post[];
}

const initialState: PostState = {
  posts: [],
};
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addMany: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    add: (state, action: PayloadAction<Post>) => {
      state.posts = [action.payload, ...state.posts]; // correct!
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      } else {
        console.warn("⚠️ Post with ID not found in state:", action.payload.id);
      }
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    addAnswerPost: (
      state,
      action: PayloadAction<{ id: string; answer: Answer }>
    ) => {
      const { id, answer } = action.payload;

      const post = state.posts.find((post) => post.id === id);

      if (!post) {
        console.warn(`⚠️ Post with ID ${id} not found in state`);
        return;
      }
      post.answers?.push(action.payload.answer);
    },
    removeAnswerPost: (
      state,
      action: PayloadAction<{ postId: string; answerId: string }>
    ) => {
      const { postId, answerId } = action.payload;

      const post = state.posts.find((post) => post.id === postId);

      if (!post) {
        console.warn(`⚠️ Post with ID ${postId} not found in state`);
        return;
      }
      post.answers = post.answers?.filter((a) => a.id !== answerId);
    },
  },
});

export const postActions = postSlice.actions;
export default postSlice.reducer;

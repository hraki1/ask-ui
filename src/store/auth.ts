import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import User from "../Model/User";
import Post from "../Model/Post";
import Answer from "../Model/Answer";

export interface InitialState {
  isLoggedin: boolean;
  token: string;
  user?: User;
}

const initialState: InitialState = {
  isLoggedin: false,
  token: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedin = !!action.payload.token;
      localStorage.setItem("token", action.payload.token); // no JSON.stringify
      localStorage.setItem("userId", action.payload.user.id); // no JSON.stringify
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 24);
      localStorage.setItem("expiration", expiration.toISOString());
    },
    logout: (state) => {
      state.isLoggedin = false;
      state.token = "";
      state.user = undefined;
      localStorage.removeItem("token");
      localStorage.removeItem("expiration");
      localStorage.removeItem("userId");
    },
    autoLogin: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      // console.log("AutoLogin Reducer:", action.payload);
      state.user = { ...action.payload.user };
      state.token = action.payload.token;
      state.isLoggedin = true;
    },

    setIsLogin: (state, action: PayloadAction<void>) => {
      state.isLoggedin = true;
    },

    addPost: (state, action: PayloadAction<Post>) => {
      if (!state.user || !state.user.posts) return;
      console.log("added");
      state.user.posts = [action.payload, ...state.user.posts];
    },

    // ✅ Improved updatePost
    updatePost: (state, action: PayloadAction<Post>) => {
      if (!state.user || !state.user.posts) return;
      const index = state.user.posts.findIndex(
        (post) => post.id === action.payload.id
      );

      if (index !== -1) {
        state.user.posts = [...state.user.posts];
        state.user.posts[index] = action.payload;
      } else {
        console.warn(
          `⚠️ Post with ID ${action.payload.id} not found in user.posts`
        );
      }
    },
    // ✅ Improved removePost
    removePost: (state, action: PayloadAction<string>) => {
      if (!state.user || !state.user.posts) return;
      state.user.posts = [
        ...state.user.posts.filter((post) => post.id !== action.payload),
      ];
      if (state.user.savedPosts?.some((p) => p.id === action.payload)) {
        state.user.savedPosts = [
          ...state.user.savedPosts.filter((post) => post.id !== action.payload),
        ];
      }
    },
    updateSavedPosts: (state, action: PayloadAction<Post[]>) => {
      if (!state.user) return;

      state.user = {
        ...state.user,
        savedPosts: action.payload, // تحديث القائمة كاملة
      };
    },
    // أو إذا كنت تريد إضافة/إزالة منشور واحد فقط:
    toggleSavedPost: (state, action: PayloadAction<Post>) => {
      if (!state.user || !state.user.savedPosts) return;

      const postIndex = state.user.savedPosts.findIndex(
        (post) => post.id === action.payload.id
      );

      if (postIndex === -1) {
        // إضافة المنشور إذا لم يكن موجودًا
        state.user.savedPosts = [action.payload, ...state.user.savedPosts];
      } else {
        // إزالته إذا كان موجودًا
        state.user.savedPosts.splice(postIndex, 1);
      }
    },
    updateContentForSavedPost: (state, action: PayloadAction<Post>) => {
      if (!state.user || !state.user.savedPosts) return;
      const postIndex = state.user.savedPosts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (postIndex !== -1) {
        state.user.savedPosts[postIndex] = action.payload;
      }
    },
    addAnswer: (
      state,
      action: PayloadAction<{ id: string; answer: Answer }>
    ) => {
      if (!state.user || !state.user.posts) return;
      const { id, answer } = action.payload;

      state.user.answers = [answer, ...state.user.answers];
      const post = state.user.posts.find((post) => post.id === id);

      if (!post) {
        console.warn(`⚠️ Post with ID ${id} not found in state`);
        return;
      }
      post.answers?.push(action.payload.answer);
    },
    removeAnswer: (state, action) => {
      if (!state.user || !state.user.answers) return;
      const { id, answer } = action.payload;
      state.user.answers = [
        ...state.user.answers.filter((a) => a.id !== answer.id),
      ];
      const postIndex = state.user.posts.findIndex((post) => post.id === id);
      if (postIndex === -1) {
        console.warn(`⚠️ Post with ID ${id} not found in state`);
        return;
      }
      state.user.posts[postIndex].answers = state.user.posts[
        postIndex
      ].answers?.filter((a) => a.id !== answer.id);
    },
    removeAnswerFromProfileAnswers: (state, action) => {
      if (!state.user || !state.user.answers) return;
      const { id } = action.payload;
      console.log("re pro");
      state.user.answers = [...state.user.answers.filter((a) => a.id !== id)];
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

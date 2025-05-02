import { QueryClient } from "@tanstack/react-query";
import Post from "./Model/Post";
import User from "./Model/User";
import UpsertPost from "./Model/UpsertPost";
import UpsertAnswer from "./Model/UpsertAnswer";
import Answer from "./Model/Answer";
import UpsertUser from "./Model/UpsertUser";
import Notification from "./Model/Notification";

export const queryClient = new QueryClient();
const BASE_URL = process.env.REACT_APP_URL;

// Post Section

export const fetchPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${BASE_URL}/posts`);

    if (!response.ok) {
      console.error("Error fetching posts:", response.statusText);
      throw new Error("Failed to fetch posts.");
    }

    const posts: Post[] = await response.json();

    return posts;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Optional: rethrow for error handling in React Query or try/catch
  }
};

type FetchPostParams = {
  postId: string;
  signal?: AbortSignal;
};

export const fetchPost = async ({
  postId,
  signal,
}: FetchPostParams): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/posts/${postId}`, {
    signal,
  });

  if (!response.ok) {
    console.log("Somthing went wrong");
  }

  const post = await response.json();

  return post;
};

type FetchPostByUserIdParams = {
  userId: string;
  signal?: AbortSignal;
};

export const fetchPostsByUserId = async ({
  userId,
  signal,
}: FetchPostByUserIdParams): Promise<Post[]> => {
  const response = await fetch(`${BASE_URL}/posts/user/${userId}`, {
    signal,
  });

  const resData = await response.json();
  if (!response.ok) {
    console.log("Somthing went wrong");
  }
  const posts = [...resData.posts].reverse();
  return posts;
};

export const createPost = async (newPost: UpsertPost): Promise<Post> => {
  const formData = new FormData();

  formData.append("title", newPost.title);
  if (newPost.creator) {
    formData.append("creator", newPost.creator);
  }
  formData.append("question", newPost.question);
  if (newPost.image) {
    formData.append("image", newPost.image);
  }

  const response = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: formData,
  });

  const resData = await response.json();
  if (!response.ok) {
    console.log(resData);
    throw new Error("Failed to create post!D");
  }

  return resData.post;
};

export const updatedPost = async (
  newPost: UpsertPost,
  id: string
): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/posts/` + id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: JSON.stringify(newPost),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Faild to create post!D");
  }

  return resData.post;
};

export const DeletePost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/posts/${id}`, {
      method: "DELETE",
      body: null,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
      },
    });

    if (!response.ok) {
      console.error("Something went wrong while deleting the post.");
      throw new Error("Failed to delete post.");
    }
  } catch (error) {
    console.error("Delete request error:", error);
    throw error;
  }
};

export const toggleLikePost = async (
  postId: string,
  userId: string
): Promise<Post> => {
  const response = await fetch(`${BASE_URL}/posts/like/` + postId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: JSON.stringify({ userId: userId }),
  });

  const resData = await response.json();

  if (!response.ok) {
    console.log(resData);
    throw new Error("Faild to create post!D");
  }

  return resData;
};

//Authentication Section

type handleAuthProps = {
  mode: string;
  user: UpsertUser;
};

export const handleAuth = async ({
  mode,
  user,
}: handleAuthProps): Promise<{
  statusCode?: number;
  message?: string;
  user?: User;
  token?: string;
}> => {
  if (mode !== "login" && mode !== "signup") {
    console.error("Unsupported moder");
  }

  const response = await fetch(`${BASE_URL}/users/` + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const resData = await response.json();

  if (response.status === 200 || response.status === 201) {
    return {
      statusCode: response.status,
      user: resData.user,
      token: resData.token,
    };
  }
  return { statusCode: response.status, message: resData.message };
};

export const fetchUserById = async (userId?: string) => {
  const response = await fetch(`${BASE_URL}/users/` + userId);
  const resData = await response.json();

  if (response.status === 200) {
    return resData;
  }
  return { statusCode: response.status, message: resData.message };
};

export const updatedProfile = async (newUser: UpsertUser): Promise<User> => {
  const formData = new FormData();

  if (newUser.id) {
    formData.append("userId", newUser.id);
  }
  if (newUser.name) {
    formData.append("name", newUser.name);
  }
  if (newUser.bio) {
    formData.append("bio", newUser.bio);
  }
  if (newUser.image) {
    formData.append("image", newUser.image);
  }

  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: formData,
  });
  const resData = await response.json();

  if (!response.ok) {
    console.log(resData);
    throw new Error("Failed to create post!D");
  }

  return resData;
};

export const savePost = async (userId: string, postId: string) => {
  const response = await fetch(`${BASE_URL}/profile/save/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: JSON.stringify({ postId }),
  });

  const resData = await response.json();
  if (!response.ok) {
    console.log(resData);
    throw new Error(resData.message || "Failed to save post.");
  }

  return resData;
};

export const unsavePost = async (userId: string, postId: string) => {
  const response = await fetch(`${BASE_URL}/profile/unsave/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: JSON.stringify({ postId }),
  });

  const resData = await response.json();
  if (!response.ok) {
    console.log(resData);
    throw new Error(resData.message || "Failed to unsave post.");
  }

  return resData;
};

// Answer Section

type FetchAnswersByUserIdParams = {
  userId?: string;
};

export const fetchAnswersByUserId = async ({
  userId,
}: FetchAnswersByUserIdParams): Promise<Answer[]> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const response = await fetch(`${BASE_URL}/answers/user/${userId}`);

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch answers");
  }

  // Ensure we're returning answers, not posts
  return resData.answers || [];
};

export const createAnswer = async (
  newAnswer: UpsertAnswer
): Promise<Answer> => {
  const response = await fetch(`${BASE_URL}/answers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
    body: JSON.stringify(newAnswer),
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Faild to create answer!");
  }

  return resData.answer;
};

export const deleteAnswer = async (
  id: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${BASE_URL}/answers/${id}`, {
      method: "DELETE",
      body: null,
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
      },
    });

    const resData = await response.json();
    if (!response.ok) {
      console.error("Something went wrong while deleting the post.");
      throw new Error("Failed to delete post.");
    }
    return resData;
  } catch (error) {
    console.error("Delete request error:", error);
    throw error;
  }
};

// Notification Section

type FetchNotificationsParams = {
  userId?: string;
  signal?: AbortSignal;
};

export const fetchNotificationsByUserId = async ({
  userId,
  signal,
}: FetchNotificationsParams): Promise<Notification[]> => {
  // Assuming it returns an array
  const response = await fetch(`${BASE_URL}/notifications/user/${userId}`, {
    signal,
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return resData.notifications;
};

export const readNotification = async (id: string): Promise<Notification> => {
  const response = await fetch(`${BASE_URL}/notifications/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"), // Assuming token is stored in localStorage
    },
  });
  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return resData;
};

export const deleteNotification = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!response.ok) {
      console.error("Something went wrong while deleting the notification.");
      throw new Error("Failed to delete notification.");
    }
  } catch (error) {
    console.error("Delete request error:", error);
    throw error;
  }
};

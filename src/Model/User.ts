import Answer from "./Answer";
import Post from "./Post";

export default interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  imageUrl?: string;
  bio?: string;
  posts: Post[];
  answers: Answer[];
  savedPosts?: Post[];
}

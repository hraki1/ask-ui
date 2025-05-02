import Post from "./Post";
import User from "./User";

export default interface Answer {
  id: string;
  answer: string;
  author: string;
  postId: string | Post;
  creator?: User;
  createdAt: string;
}

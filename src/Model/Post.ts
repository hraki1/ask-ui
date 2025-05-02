import Answer from "./Answer";
import User from "./User";
export default interface Post {
  id: string;
  title: string;
  question: string;
  creator: User;
  likes: string[];
  imageUrl?: string;
  answers?: Answer[];
  createdAt: string;
}

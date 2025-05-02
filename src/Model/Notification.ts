import User from "./User";

export default interface Notification {
  id: string;
  sender: User;
  receiver: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  postId: string;
}

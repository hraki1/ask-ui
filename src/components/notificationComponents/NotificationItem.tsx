import React from "react";
import profileImg from "../../assets/images/download.png";
import { Check, Heart, MessageCircleMore, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteNotification, queryClient, readNotification } from "../../http";
import { motion } from "framer-motion";
import { useAppDispatch } from "../../store/hooks";
import Notification from "../../Model/Notification";
import { notificationActions } from "../../store/notification";
import { useNavigate } from "react-router-dom";

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { mutate: mutateDelete } = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
  });

  const { mutate: mutateRead } = useMutation({
    mutationFn: readNotification,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
      dispatch(notificationActions.updateNotification(data));
    },
  });

  const markAsReadHandler = (id: string) => {
    mutateRead(id);
  };

  const deleteNotificationHandler = (id: string) => {
    mutateDelete(id);
  };

  const handleOnClickNoti = () => {
    if (notification.type === "answer") {
      navigate(`/home/post/${notification.postId}?focus=comments`);
    } else {
      navigate(`/home/post/${notification.postId}`);
    }
    markAsReadHandler(notification.id);
  };

  const viewUserProfile = () => {
    navigate(`/home/user-profile/${notification.sender.id}`);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout
      className={`px-4 py-3 shadow-sm border transition-all duration-300 cursor-pointer 
        ${
          !notification.isRead
            ? "bg-[#1E293B] border-sky-600 hover:border-sky-400"
            : "bg-[#0F172A] border-slate-700 hover:border-slate-500"
        }`}
    >
      <div className="flex items-start gap-3">
        <img
          onClick={viewUserProfile}
          src={
            notification.sender.imageUrl
              ? `${process.env.REACT_APP_ASSET_URL}/${notification.sender.imageUrl}`
              : profileImg
          }
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div onClick={handleOnClickNoti}>
              {notification.type === "like" && (
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {notification.sender.name}
                  </span>{" "}
                  liked your post
                  <Heart className="w-4 h-4 inline text-red-500 ml-1" />
                </p>
              )}
              {notification.type === "answer" && (
                <p className="text-sm text-white">
                  <span className="font-semibold">
                    {notification.sender.name}
                  </span>{" "}
                  added an answer to your post
                  <MessageCircleMore className="w-4 h-4 inline text-blue-400 ml-1" />
                </p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatTime(notification.createdAt)}
              </p>
            </div>
            <div className="flex items-center space-x-2 ml-3">
              {!notification.isRead && (
                <button
                  onClick={() => markAsReadHandler(notification.id)}
                  className="text-gray-400 hover:text-green-400 transition"
                >
                  <Check size={18} />
                </button>
              )}
              <button
                onClick={() => deleteNotificationHandler(notification.id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;

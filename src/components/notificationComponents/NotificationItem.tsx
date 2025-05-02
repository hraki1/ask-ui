import React, { useCallback } from "react";
import profileImg from "../../assets/images/download.png";
import { Check, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteNotification, queryClient, readNotification } from "../../http";
import { motion, useAnimation } from "framer-motion";
import { useAppDispatch } from "../../store/hooks";
import Notification from "../../Model/Notification";
import { notificationActions } from "../../store/notification";

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => {
  const controls = useAnimation();
  const dispatch = useAppDispatch();

  const { data, mutate: mutateDelete } = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
    },
  });

  const { mutate: mutateRead } = useMutation({
    mutationFn: (id: string) => readNotification(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notification"] });
      console.log(data);
      dispatch(notificationActions.updateNotification(data));
    },
  });

  const markAsReadHandler = (id: string) => {
    console.log("Mark as read:", id);
    mutateRead(id);
    handlerReadAnimating();
  };

  const deleteNotificationHandler = (id: string) => {
    console.log("Delete notification:", id);
    mutateDelete(id);
    handlerDeleteAnimating();
  };

  const handlerDeleteAnimating = useCallback(() => {
    controls.start({
      opacity: 0,
      scale: 0.5,
      y: -100,
      filter: "blur(4px)",
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1], // smoother bezier curve
      },
    });
  }, [controls]);

  const handlerReadAnimating = useCallback(() => {
    controls.start({
      scale: [1, 1.03, 1],
      backgroundColor: ["#1E293B", "#334155", "#0F172A"],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    });
  }, [controls]);

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
      animate={controls}
      className={`p-4 flex items-start space-x-3 ${
        !notification.isRead ? "bg-[#1E293B]" : ""
      }`}
    >
      <img
        src={
          notification.sender.imageUrl !== ""
            ? `${process.env.REACT_APP_ASSET_URL}/${notification.sender.imageUrl ?? ""}`
            : profileImg
        }
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="text-sm">{notification.sender.name} like your post.</p>
          <div className="flex space-x-2">
            {!notification.isRead && (
              <button
                onClick={() => markAsReadHandler(notification.id)}
                className="text-gray-400 hover:text-white"
              >
                <Check size={16} />
              </button>
            )}
            <button
              onClick={() => deleteNotificationHandler(notification.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-400">
            {formatTime(notification.createdAt)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;

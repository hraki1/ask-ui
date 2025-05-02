import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchNotificationsByUserId } from "../http";
import Notification from "../Model/Notification";
import Spinner from "../components/UI/SpinnerLoading";
import NotificationItem from "../components/notificationComponents/NotificationItem";
import { notificationActions } from "../store/notification";

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Usage in component
  const { data, isLoading, error } = useQuery<Notification[]>({
    queryKey: ["notification"],
    queryFn: ({ signal }) => fetchNotificationsByUserId({ userId, signal }),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      dispatch(notificationActions.addMany(data)); // Dispatch when data is available
    }
  }, [dispatch, data]);

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="h-[100vh] flex justify-center py-36">
        <h1 className="text-white text-5xl">Somthing went wrong</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[100vh] flex justify-center py-36">
        <h1 className="text-white text-5xl">There is No Notifications</h1>
      </div>
    );
  }

  const notifications = [...data].reverse();

  const filteredNotifications = showUnreadOnly
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0F172A] min-h-screen text-white flex justify-center"
    >
      <div className="w-full md:w-1/2 shadow-md shadow-slate-700">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h1 className="text-xl font-bold">Notifications</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowUnreadOnly(!showUnreadOnly)}
              className={`px-3 py-1 rounded-md text-sm ${
                showUnreadOnly ? "bg-blue-600" : "bg-[#1F2A40]"
              }`}
            >
              {showUnreadOnly ? "Showing Unread" : "Show All"}
            </button>
            <div className="p-2 bg-[#1F2A40] rounded-lg">
              <Bell size={20} />
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-800">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <NotificationItem notification={notification} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Bell className="mx-auto mb-3" size={32} />
              <p>No notifications yet</p>
              {showUnreadOnly && (
                <button
                  onClick={() => setShowUnreadOnly(true)}
                  className="mt-2 text-blue-500 hover:text-blue-400 text-sm"
                >
                  Show all notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationPage;

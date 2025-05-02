import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import Navigation from "../components/Navigation";
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { authActions } from "../store/auth";
import { fetchNotificationsByUserId, fetchPosts, fetchUserById } from "../http";
import User from "../Model/User";
import Spinner from "../components/UI/SpinnerLoading";
import { useQuery } from "@tanstack/react-query";
import Post from "../Model/Post";
import Notification from "../Model/Notification";
import { notificationActions } from "../store/notification";
import { postActions } from "../store/post";

const Homelayout = () => {
  const dispatch = useAppDispatch();

  // handle posts and notification started *************************************************************************

  const user = useAppSelector((state) => state.auth.user);

  let { data, isLoading, error } = useQuery<Post[]>({
    queryKey: ["posts"], // A unique key for this query
    queryFn: fetchPosts, // The fetch function
  });

  const userId = user?.id;
  const { data: notifications, isLoading: notificationIsLoading } = useQuery<
    Notification[]
  >({
    queryKey: ["notification"],
    queryFn: ({ signal }) => fetchNotificationsByUserId({ userId, signal }),
    enabled: !!userId,
  });

  useEffect(() => {
    if (data) {
      dispatch(postActions.addMany(data)); // Dispatch when data is available
    }
    if (notifications) {
      dispatch(notificationActions.addMany(notifications)); // Dispatch when data is available
    }
  }, [data, dispatch, notifications]);

  if (isLoading || notificationIsLoading) {
    return (
      <div className="text-center bg-[#0B1C2C]">
        <Navigation />
        <main className="min-h-[calc(100vh-92px)]">
          <Spinner />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center bg-[#0B1C2C]">
        <Navigation />
        <main className="min-h-[calc(100vh-92px)]">
          <div className="h-[100vh] flex justify-center py-36">
            <h1 className="text-white text-5xl">Somthing went wrong</h1>
          </div>
        </main>
      </div>
    );
  }

  // handle posts and notification end *************************************************************************
  return (
    <div className="text-center bg-[#0B1C2C]">
      <Navigation />
      <main className="min-h-[calc(100vh-92px)]">{<Outlet />}</main>
    </div>
  );
};

export default Homelayout;

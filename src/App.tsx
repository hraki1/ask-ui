import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import { Suspense } from "react";
import "./App.css";
import Root from "./pages/RootLayout";
import Homelayout from "./pages/HomeLayout";
import LandingPage from "./pages/LandingPage";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./http";
import NotFound from "./pages/NotFound";
import { tokenLoader } from "./util/auth";
import { action as logoutAction } from "./pages/Logout";
import Spinner from "./components/UI/SpinnerLoading";

const Profile = React.lazy(() => import("./pages/ProfilePage"));
const Notification = React.lazy(() => import("./pages/NotificationPage"));
const PostPage = React.lazy(() => import("./pages/PostPage"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const Authentication = React.lazy(() => import("./pages/AuthPage"));
const Home = React.lazy(() => import("./pages/HomePage"));

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: "",
      element: <Root />,
      loader: tokenLoader,
      hydrateFallbackElement: <p>Loading...</p>,
      children: [
        { index: true, element: <LandingPage /> },
        {
          path: "home",
          element: <Homelayout />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<Spinner />}>
                  <Home />
                </Suspense>
              ),
            },
            {
              path: "auth",
              element: (
                <Suspense fallback={<Spinner />}>
                  <Authentication />
                </Suspense>
              ),
            },
            { path: "logout", action: logoutAction },
            {
              path: "notification",
              element: (
                <Suspense fallback={<Spinner />}>
                  <Notification />
                </Suspense>
              ),
            },
            {
              path: "profile",
              element: (
                <Suspense fallback={<Spinner />}>
                  <Profile />
                </Suspense>
              ),
            },
            {
              path: "user-profile/:id",
              element: (
                <Suspense fallback={<Spinner />}>
                  <UserProfile />
                </Suspense>
              ),
            },
            {
              path: "post/:id",
              children: [
                {
                  index: true,
                  element: (
                    <Suspense fallback={<Spinner />}>
                      <PostPage />
                    </Suspense>
                  ),
                },
              ],
            },
            { path: "*", element: <NotFound /> },
          ],
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={router}
        fallbackElement={<Spinner />}
      ></RouterProvider>
    </QueryClientProvider>
  );
};

export default App;

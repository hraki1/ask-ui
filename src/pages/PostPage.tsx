import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import React, { useEffect } from "react";

import profileImg from "../assets/images/download.png";
import { useQuery } from "@tanstack/react-query";
import { fetchPost } from "../http";
import Post from "../Model/Post";
import Spinner from "../components/UI/SpinnerLoading";
import { ChevronLeft } from "lucide-react";
import PostItemOptions from "../components/homePageComponents/PostItemOptions";
import Answers from "../components/postPageComponents/Answers";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";
import PostActions from "../components/homePageComponents/PostActions";

const PostPage = () => {
  const [searchParams] = useSearchParams();
  const focusOnComment = searchParams.get("focus"); // e.g., "posts"
  const auth = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (focusOnComment === "comments") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [focusOnComment]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const postId = id?.toString() || "";

  const {
    data: post,
    isLoading,
    error,
  } = useQuery<Post>({
    queryKey: [id],
    queryFn: ({ signal }) => fetchPost({ postId, signal }),
  });

  function returnToHomePageHandler() {
    navigate(-1);
  }

  const viewUserProfile = () => {
    if (post && post.creator.id === auth.user?.id) {
      navigate(`/home/profile`);
    } else {
      if (post) {
        navigate(`/home/user-profile/${post.creator.id}`);
      }
    }
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="h-[100vh] flex justify-center py-36">
        <h1 className="text-white text-5xl">Somthing went wrong</h1>
      </div>
    );
  }

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
    <>
      {post && (
        <>
          <div className="flex justify-center bg-[#0B1C2C] min-h-screen">
            <div className="w-full md:w-[50%] px-4 py-6">
              <li
                className="list-none relative bg-[#1F2A40] shadow-lg rounded-2xl transition-all duration-300"
                key={post.id}
              >
                <div className="py-4 flex justify-between">
                  <div className="flex items-center cursor-pointer">
                    <ChevronLeft
                      onClick={returnToHomePageHandler}
                      className="text-white h-9 w-9 mr-3"
                    />

                    <img
                      onClick={viewUserProfile}
                      src={
                        post.creator?.imageUrl !== ""
                          ? `${process.env.REACT_APP_ASSET_URL}/${
                              post.creator?.imageUrl ?? ""
                            }`
                          : profileImg
                      }
                      className="w-12 h-12 rounded-full object-cover mr-3"
                      alt="profile"
                    />
                    <div onClick={viewUserProfile} className="flex flex-col">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {post.creator.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {post.creator?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mr-2">
                    <p className="ml-3 space-x-6 text-gray-600 text-sm mr-3">
                      {formatTime(post.createdAt)}
                    </p>
                    {auth.user?.id === post.creator.id && (
                      <PostItemOptions post={post} isPostPage={true} />
                    )}
                  </div>
                </div>

                <div className="px-4 py-5 text-start">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white mb-5">
                    {post.title}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {post.question}
                  </p>
                  {post.imageUrl !== "" && (
                    <img
                      src={`${process.env.REACT_APP_ASSET_URL}/${post.imageUrl}`}
                      className="w-full rounded-lg"
                      alt="post"
                    />
                  )}
                </div>

                <PostActions post={post} />
                <hr className="border-t border-gray-300 dark:border-gray-600 mx-4" />
                <Answers post={post} />
              </li>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PostPage;

import { Key, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MessageCircleX,
} from "lucide-react";

import profileImg from "../assets/images/download.png";
import Spinner from "../components/UI/SpinnerLoading";
import PostItem from "../components/homePageComponents/PostItem";
import AnswerItem from "../components/postPageComponents/Answer";
import { useQuery } from "@tanstack/react-query";
import { fetchUserById } from "../http";
import Post from "../Model/Post";
import Answer from "../Model/Answer";

const UserProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, []);

  const { id } = useParams<{ id: string }>();
  const userId = id?.toString() || "";

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
  });

  const [activeTab, setActiveTab] = useState<"posts" | "answers">("posts");
  const [showStats, setShowStats] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!user) {
    return <Spinner />;
  }

  const getProfileImageUrl = () => {
    if (user?.imageUrl) {
      return user.imageUrl.startsWith("http")
        ? user.imageUrl
        : `${process.env.REACT_APP_ASSET_URL}/${user.imageUrl}`;
    }
    return profileImg;
  };

  function returnToHomePageHandler() {
    navigate(-1);
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#0F172A] min-h-screen shadow-md sha flex justify-center text-white"
      >
        <div className="w-full md:w-1/2 shadow-md shadow-slate-700">
          <div className=" cursor-pointer fixed left-5 top-[101px] z-50 rounded-full bg-gray-700 h-12 w-12">
            <ChevronLeft
              onClick={returnToHomePageHandler}
              className="text-white h-9 w-9 mt-[5px] ml-[4px]"
            />
          </div>
          {/* Cover Photo */}
          <div className="relative h-32 w-full overflow-hidden">
            <img
              src={`https://img.freepik.com/free-photo/abstract-luxury-gradient-blue-background-smooth-dark-blue-with-black-vignette-studio-banner_1258-52393.jpg?semt=ais_hybrid&w=740`}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile Header */}
          <div className="px-6 relative">
            <div className="flex justify-between items-start">
              <div className="relative -mt-16">
                <img
                  src={getProfileImageUrl()}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-[#1F2A40] object-cover"
                />
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`px-6 py-2 rounded-lg font-medium ${
                    isFollowing
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="mt-2">{user.bio}</p>

              <div
                className="mt-4 bg-[#1F2A40] rounded-lg p-3 cursor-pointer"
                onClick={() => setShowStats(!showStats)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex space-x-6">
                    <div className="text-center">
                      <p className="font-bold">{user?.posts.length ?? 0}</p>
                      <p className="text-sm text-gray-400">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold">{user?.answers.length ?? 0}</p>
                      <p className="text-sm text-gray-400">Answers</p>
                    </div>
                  </div>
                  {showStats ? <ChevronUp /> : <ChevronDown />}
                </div>

                <AnimatePresence>
                  {showStats && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex justify-between mb-2">
                          <span>Joined</span>
                          <span>{formatTime(user.createdAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800 mt-6">
            {(["posts", "answers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium relative ${
                  activeTab === tab
                    ? "text-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="tabIndicator"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="pb-20 mx-1">
            {activeTab === "posts" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="divide-y divide-gray-800 list-none"
              >
                {user.posts.length > 0 ? (
                  user.posts.map((post: Post, index: number) => (
                    <PostItem key={index} post={post} inProfile />
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <MessageCircleX className="mx-auto mb-3" size={32} />
                    <p>No posts yet</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "answers" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center mx-5"
              >
                {user.answers.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <MessageCircleX className="mx-auto mb-3" size={32} />
                    <p>No answers yet</p>
                  </div>
                ) : (
                  <div className="relative">
                    {user.answers.map(
                      (answer: Answer, index: Key | null | undefined) => (
                        <AnswerItem
                          key={index}
                          answer={answer}
                          isLink
                          postId={
                            typeof answer.postId === "object"
                              ? answer.postId.id
                              : answer.postId
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserProfile;

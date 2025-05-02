import { motion } from "framer-motion";
import { Heart, MessageCircle, Share } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import Post from "../../Model/Post";
import { useMutation } from "@tanstack/react-query";
import { queryClient, toggleLikePost } from "../../http";
import { postActions } from "../../store/post";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast"; // optional for feedback
import { authActions } from "../../store/auth";
import Spinner from "../UI/SpinnerLoading";

const PostActions: React.FC<{
  post: Post;
  inProfile?: boolean;
}> = ({ post, inProfile }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const auth = useAppSelector((state: RootState) => state.auth);

  const { mutate } = useMutation({
    mutationFn: () => toggleLikePost(post.id, auth.user?.id || ""),
    onSuccess: async (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: [post.id] });
      dispatch(postActions.updatePost(updatedPost));
      if (auth.user?.id === updatedPost.creator.id) {
        dispatch(authActions.updatePost(updatedPost));
      }
      if (auth.user?.savedPosts?.some((p) => p.id === post.id)) {
        dispatch(authActions.updateContentForSavedPost(updatedPost));
      }
      if (inProfile) {
        queryClient.invalidateQueries({ queryKey: ["user", post.creator.id] });
      }
    },
    onError: () => {
      setLiked((prev) => !prev);
    },
  });

  const audio = new Audio("/clickSound.mp3");

  const isLiked = auth.user?.id ? post.likes.includes(auth.user.id) : false;

  const [liked, setLiked] = useState<boolean>(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  function likePostHandler() {
    setLiked((prev) => !prev);

    audio.play();

    mutate();
  }

  function viewPost(queries: string = "") {
    navigate(`/home/post/${post.id}` + queries);
  }

  // Inside PostActions component

  async function sharePostHandler() {
    const url = `${window.location.origin}/home/post/${post.id}`;
    const shareData = {
      title: post.title ?? "Check out this post!",
      text: post.question.slice(0, 100) + "...",
      url,
    };

    // 1. Try Web Share API first (mobile devices)
    if (canUseWebShare()) {
      try {
        await navigator.share(shareData);
        toast.success("Post shared!");
        return;
      } catch (error) {
        console.log("Share failed:", error);
        // Continue to fallback if share was canceled
        if ((error as Error).name !== "AbortError") {
          toast.error("Sharing failed");
        }
      }
    }

    // 2. Fallback to Clipboard API
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (clipboardError) {
      console.error("Clipboard failed:", clipboardError);
      // 3. Ultimate fallback for older browsers
      if (copyViaExecCommand(url)) {
        toast.success("Link copied!");
      } else {
        toast.error("Failed to copy link");
        // Last resort: show the URL for manual copy
        prompt("Copy this link:", url);
      }
    }
  }

  // Helper functions
  function canUseWebShare() {
    return (
      typeof navigator.share === "function" &&
      (window.isSecureContext ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    );
  }

  function copyViaExecCommand(text: string): boolean {
    let textarea: HTMLTextAreaElement | null = null;
    try {
      textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      document.body.appendChild(textarea);
      textarea.select();
      return document.execCommand("copy");
    } catch (e) {
      return false;
    } finally {
      if (textarea) {
        document.body.removeChild(textarea);
      }
    }
  }

  // if (!auth.user) {
  //   return <Spinner />;
  // }

  return (
    <div className="pt-2 pb-4">
      <div className="flex justify-around text-gray-600 text-sm pt-2">
        <button
          onClick={
            auth.isLoggedin
              ? likePostHandler
              : () => navigate("/home/auth?mode=login")
          }
          className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
        >
          {liked ? (
            <motion.svg
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{
                scale: [1.5, 1, 1.3, 1],
                rotate: [0, -10, 10, 0],
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-red-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
     4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 
     14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
     6.86-8.55 11.54L12 21.35z"
              />
            </motion.svg>
          ) : (
            <Heart className="text-white w-6 h-6" />
          )}
          <span className={liked ? "text-red-500" : "text-white"}>
            {post.likes.length === 0 ? "" : post.likes.length}
          </span>
        </button>

        <button
          onClick={() => viewPost && viewPost(`?focus=comments`)}
          className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
        >
          <MessageCircle className=" text-white w-6 h-6" />
          <span className="text-white">
            {post.answers?.length === 0 ? "" : post.answers?.length}
          </span>
        </button>

        <button
          onClick={sharePostHandler}
          className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
        >
          <Share className="text-white w-6 h-6" />
          <span className="text-white"></span>
        </button>
      </div>
    </div>
  );
};

export default PostActions;

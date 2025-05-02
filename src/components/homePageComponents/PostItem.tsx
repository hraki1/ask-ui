import profileImg from "../../assets/images/download.png";
import { useNavigate } from "react-router-dom";
import PostItemOptions from "./PostItemOptions";
import { AnimatePresence, motion } from "framer-motion";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import PostActions from "./PostActions";
import Post from "../../Model/Post";

const PostItem: React.FC<{
  post: Post;
  inProfile?: boolean;
}> = ({ post, inProfile }) => {
  const navigate = useNavigate();

  const auth = useAppSelector((state: RootState) => state.auth);

  function viewPost(queries: string = "") {
    navigate(`/home/post/${post.id}` + queries);
  }
  if (!post) return null; // guard

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

  const viewUserProfile = () => {
    if (post.creator.id === auth.user?.id) {
      navigate(`/home/profile`);
    } else {
      navigate(`/home/user-profile/${post.creator.id}`);
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.li
          className="relative bg-[#1F2A40] shadow-md rounded-2xl mt-5"
          key={post.id}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, bounce: 0.9 }}
          exit={{ y: 100, opacity: 0.3 }}
        >
          <div className="p-3 flex justify-between">
            <div className="flex items-center">
              <img
                onClick={viewUserProfile}
                src={
                  post.creator?.imageUrl !== ""
                    ? `${process.env.REACT_APP_ASSET_URL}/${post.creator?.imageUrl ?? ""}`
                    : profileImg
                }
                className=" cursor-pointer w-12 h-12 rounded-full object-cover  mr-2"
                alt=""
              />
              <div
                onClick={viewUserProfile}
                className=" cursor-pointer flex flex-col items-start"
              >
                <p className="font-bold">{post.creator?.name}</p>
                <p className="text-[12px] opacity-65">{post.creator.bio}</p>
              </div>
            </div>

            <PostItemOptions post={post} isPostPage={false} />
          </div>

          <div>
            <div className="cursor-pointer" onClick={() => viewPost()}>
              <div className="px-3 text-start">
                <p className="py-2 text-3xl font-bold">{post.title}</p>
              </div>
              <div className="px-3 text-start">
                <p className="py-2">{post.question}</p>
              </div>
              <div className="w-full max-h-[500px] overflow-hidden rounded-xl mt-2">
                {post.imageUrl !== "" && (
                  <img
                    src={`${process.env.REACT_APP_ASSET_URL}/${post.imageUrl}`}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="px-5 pt-3">
              <div className="flex justify-between items-center ml-3 space-x-6 text-gray-600 text-sm">
                <div>{formatTime(post.createdAt)}</div>
                <span
                  onClick={() => viewPost(`?focus=comments`)}
                  className="cursor-pointer"
                >
                  {post.answers?.length} comments
                </span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <hr className="border-slate-600 h-1 w-[90%] text-slate-200" />
            </div>
          </div>

          <PostActions post={post} inProfile={inProfile} />
        </motion.li>
      </AnimatePresence>
    </>
  );
};

export default PostItem;

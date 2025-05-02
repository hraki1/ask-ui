import PostItem from "./PostItem";
import { useAppSelector } from "../../store/hooks";

import { RootState } from "../../store";
import { AnimatePresence, motion } from "framer-motion";

const Posts = () => {
  const posts = useAppSelector((state: RootState) => state.posts.posts);
  if (!posts) {
    return (
      <div className="text-center bg-[#0B1C2C]">
        <main className="min-h-[calc(100vh-92px)]">No posts Available</main>
      </div>
    );
  }

  return (
    <>
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="divide-y divide-gray-800 list-none"
      >
        <AnimatePresence>
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
};

export default Posts;

import React from "react";
import Post from "../../Model/Post";
import AnswerItem from "./Answer";
import NewAnswerForm from "./NewAnswerForm";
import { motion } from "framer-motion";
import Answer from "../../Model/Answer";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";

const Answers: React.FC<{ post: Post }> = ({ post }) => {
  const isLoggedin = useAppSelector(
    (state: RootState) => state.auth.isLoggedin
  );
  return (
    <>
      <motion.div
        // whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
        id="answers"
        className="px-4 py-3 mb-36"
      >
        {post.answers && post.answers?.length === 0 && (
          <div className="flex justify-center">
            <h1 className="my-3 text-xl text-white">There is no Comments.</h1>
          </div>
        )}
        {post.answers &&
          post.answers.map((answer: Answer, index) => (
            <ul key={index} className="flex flex-col items-start">
              <AnswerItem
                key={answer.id}
                answer={answer}
                postId={post.id}
                post={post}
              />
            </ul>
          ))}
      </motion.div>
      {isLoggedin && <NewAnswerForm post={post} />}
    </>
  );
};

export default Answers;

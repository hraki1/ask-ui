import { AnimatePresence, motion } from "framer-motion";
import { Check, Edit, Ellipsis, Save, Trash, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal";
import Post from "../../Model/Post";
import {
  DeletePost,
  savePost,
  unsavePost,
  updatedPost,
} from "../../http";
import UpsertPost from "../../Model/UpsertPost";
import NewPostForm from "./NewQuestionForm";
import { RootState } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authActions } from "../../store/auth";
import { postActions } from "../../store/post";

interface PostItemOptionsProps {
  post: Post;
  isPostPage: boolean;
}

export default function PostItemOptions({
  post,
  isPostPage,
}: PostItemOptionsProps) {
  const dispatch = useAppDispatch();
  const optionsRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const user = useAppSelector((start: RootState) => start.auth.user);

  const handleToggleModal = () => setModalIsOpen((prev) => !prev);
  const handleToggleOptions = () => setIsExpanded((prev) => !prev);

  const handlePostDeletedRedirect = () => {
    setModalIsOpen(false);
    setTimeout(() => {
      if (isPostPage) {
        navigate("..");
      }
      dispatch(postActions.removePost(post.id));
      dispatch(authActions.removePost(post.id));
    }, 500);
  };

  const {
    mutate: mutateDelete,
    data,
    isPending,
  } = useMutation<void>({
    mutationFn: () => DeletePost(post.id),
    onSuccess: () => {
      setModalContent("delete-done");
    },
  });

  const { mutate: mutateSave } = useMutation({
    mutationFn: () => savePost(user?.id ?? "", post.id ?? ""),
    onSuccess: () => {
      //  dispatch(postActions.updatePost())
      dispatch(authActions.toggleSavedPost(post)); // أضف المنشور إلى المحفوظات
      handleToggleOptions();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: mutateUnsave } = useMutation({
    mutationFn: () => unsavePost(user?.id ?? "", post.id ?? ""),
    onSuccess: () => {
      dispatch(authActions.toggleSavedPost(post)); // أضف المنشور إلى المحفوظات
      handleToggleOptions();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: mutateUpdate } = useMutation({
    mutationFn: (newPost: UpsertPost) => updatedPost(newPost, post.id),
    onSuccess: (newPost) => {
      dispatch(postActions.updatePost(newPost));
      dispatch(authActions.updatePost(newPost));
      if (user?.savedPosts?.some((p) => p.id === post.id)) {
        dispatch(authActions.updateContentForSavedPost(newPost));
      }
      handleToggleOptions();
    },
  });

  const showModalHandler = (content: string) => {
    setModalContent(content);
    setModalIsOpen((prev) => !prev);
  };

  const handleDeletePost = () => {
    mutateDelete();
  };

  function method(post: UpsertPost) {
    mutateUpdate(post);
    handleToggleModal();
    handleToggleOptions();
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSavePost() {
    mutateSave();
  }

  function handleUnSavePost() {
    mutateUnsave();
  }

  const isSaved = user?.savedPosts?.findIndex((up) => up.id === post.id) !== -1;

  interface InitialValuePost {
    post: UpsertPost;
    errors: string[];
  }
  const initialValue: InitialValuePost = {
    post: {
      ...post,
      creator:
        typeof post.creator === "string" ? post.creator : post.creator.id,
      answers: post.answers?.length ? [] : undefined,
    },
    errors: [],
  };

  let content;

  if (modalContent === "delete") {
    const buttonStyle =
      "flex items-center gap-1 font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

    content = (
      <Modal open={modalIsOpen}>
        <div className="p-5">
          <h2 className="py-7 text-xl md:text-3xl">
            Do you want to delete the question: <strong>{post.title}</strong>?
          </h2>
          <div className="flex gap-3">
            <button
              disabled={isPending}
              onClick={handleDeletePost}
              className={`${buttonStyle} bg-red-600 hover:bg-red-500 text-white focus:ring-red-400`}
            >
              <Trash className="w-5 h-5" />
              {isPending ? "Deleting..." : "Delete"}
            </button>
            <button
              disabled={isPending}
              onClick={handleToggleModal}
              className={`${buttonStyle} bg-gray-700 hover:bg-gray-600 text-white focus:ring-gray-500`}
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (modalContent === "delete-done") {
    content = (
      <Modal open={modalIsOpen}>
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-full text-center">
          <h2 className="py-6 text-3xl font-semibold text-green-400">
            {data || "Deleted Successfully!"}
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePostDeletedRedirect}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
            >
              <Check className="w-5 h-5" />
              OK
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  if (modalContent === "edit") {
    content = (
      <div>
        <NewPostForm
          key={post.id} // this will force re-mounting with new initialValue
          method={method}
          open={modalIsOpen}
          handleModal={handleToggleModal}
          initialValue={initialValue}
        />
      </div>
    );
  }

  return (
    <>
      {content}

      {/* Toggle Button */}
      <button
        onClick={handleToggleOptions}
        className="duration-300 p-2 px-3 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div className="w-6 h-6 text-gray-600 dark:text-gray-300">
              <Ellipsis className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: 360 }}
              exit={{ rotate: 360 }}
              className="w-6 h-6 text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              <X className="w-6 h-6 rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Options Menu */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.ul
            key="post-options"
            ref={optionsRef}
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center w-[350px] rounded absolute right-1 top-16 bg-white dark:bg-slate-300 shadow-md"
          >
            {user?.id === post.creator.id && (
              <>
                <li
                  onClick={() => showModalHandler("delete")}
                  className="w-[100%] flex justify-center gap-1 cursor-pointer duration-200 text-slate-900 p-3 font-semibold hover:bg-slate-500 hover:text-slate-200 rounded"
                >
                  <Trash className="w-6 h-6" />
                  Delete
                </li>
                <li
                  onClick={() => showModalHandler("edit")}
                  className="w-[100%] flex justify-center gap-1 cursor-pointer duration-200 text-slate-900 p-3 pr-[27px] font-semibold hover:bg-slate-500 hover:text-slate-200 rounded"
                >
                  <Edit className="w-6 h-6" />
                  Edit
                </li>
              </>
            )}
            {isSaved ? (
              <li className=" w-[100%] flex justify-center gap-1 cursor-pointer duration-200 text-slate-900 p-3 pr-[18px] font-semibold hover:bg-slate-500 hover:text-slate-200 rounded">
                <p
                  onClick={handleUnSavePost}
                  className="w-full ml-3 flex gap-1 cursor-pointer justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                  </svg>
                  Unsave
                </p>
              </li>
            ) : (
              <li className=" w-[100%] flex justify-center gap-1 cursor-pointer duration-200 text-slate-900 p-3 pr-[18px] font-semibold hover:bg-slate-500 hover:text-slate-200 rounded">
                <p
                  className="w-full -ml-[4px] flex gap-1 cursor-pointer  justify-center"
                  onClick={handleSavePost}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Save
                </p>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </>
  );
}

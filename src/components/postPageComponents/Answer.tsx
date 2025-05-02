import React, { useState } from "react";
import profileImg from "../../assets/images/download.png";
import Answer from "../../Model/Answer";
import { useMutation } from "@tanstack/react-query";
import { deleteAnswer, queryClient } from "../../http";
import { Check, Trash, X } from "lucide-react"; // X icon
import Modal from "../UI/Modal";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authActions } from "../../store/auth";
import { postActions } from "../../store/post";
import { RootState } from "../../store";
import Post from "../../Model/Post";

const AnswerItem: React.FC<{
  answer: Answer;
  postId: string;
  post?: Post;
  isLink?: boolean;
}> = ({ answer, postId, isLink, post }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [modalContent, setModalContent] = useState("");
  const handleToggleModal = () => setModalIsOpen((prev) => !prev);
  const audio = new Audio("/deleteSound.wav");

  const auth = useAppSelector((state: RootState) => state.auth);
  const {
    mutate: deleteMutation,
    isPending,
    error,
    isError,
  } = useMutation({
    mutationFn: () => deleteAnswer(answer.id),
    onSuccess: (newAnswer) => {
      queryClient.invalidateQueries({ queryKey: [postId] });
      dispatch(postActions.removeAnswerPost({ postId, answerId: answer.id }));
      if (post && post.creator.id === auth.user?.id) {
        dispatch(authActions.removeAnswer({ id: post.id, answer: newAnswer }));
      }
      if (!post) {
        dispatch(authActions.removeAnswerFromProfileAnswers({ id: answer.id }));
      }
      setErrorMsg(null);
      handleToggleModal();
      audio.play();
    },
    onError: () => {
      setErrorMsg("Failed to delete the answer.");
    },
  });

  if (isError) {
    console.log(error);
  }

  const handleDeleteAnswer = () => {
    deleteMutation();
  };

  const handleLikeAnswer = () => {
    navigate(`/home/post/${postId}?focus=comment`);
  };

  const viewUserProfile = () => {
    if (answer.creator?.id === auth.user?.id) {
      navigate(`/home/profile`);
    } else {
      if (answer.creator?.id) {
        navigate(`/home/user-profile/${answer.creator.id}`);
      }
    }
  };

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

  const showDeleteButton =
    answer.creator?.id === auth.user?.id ||
    post?.creator.id === auth.user?.id ||
    answer.creator === auth.user?.id;

  const buttonStyle =
    "flex items-center gap-1 font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  let content = (
    <Modal open={modalIsOpen}>
      <div className="p-5">
        <h2 className="py-7 text-xl md:text-3xl">
          <strong className=" break-words">
            Do you want to delete the answer:
            {answer.answer.length > 20
              ? answer.answer.slice(0, 20) + "..."
              : answer.answer}
          </strong>
        </h2>
        <div className="flex gap-3">
          <button
            disabled={isPending}
            onClick={handleDeleteAnswer}
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

  if (isError) {
    content = (
      <Modal open={modalIsOpen}>
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-full text-center">
          <h2 className="py-6 text-3xl font-semibold text-green-400">
            {error?.message ?? "Deleted Successfully!"}
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleToggleModal}
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

  return (
    <>
      {content}
      <li
        id={answer.id}
        className="flex my-1 max-w-full items-start gap-4 relative group px-2 py-1 rounded-lg transition-colors duration-150"
      >
        {/* الصورة الذاتية مع تأثيرات محسنة */}
        <div
          onClick={viewUserProfile}
          className="flex-shrink-0 pt-1 cursor-pointer"
        >
          <img
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-[#1e3a8a] hover:border-[#3b82f6] transition-all duration-200"
            src={
              answer.creator?.imageUrl
                ? `${process.env.REACT_APP_ASSET_URL}/${answer.creator.imageUrl}`
                : profileImg
            }
            alt={`صورة ${answer.author}`}
          />
        </div>

        {/* فقاعة المحادثة مع تحسينات للنصوص الطويلة */}
        <div className={`flex-1 min-w-0 ${isPending && "opacity-60"}`}>
          <div
            onClick={isLink ? handleLikeAnswer : undefined}
            className={`bg-[#0a192f] rounded-xl p-4 pr-8 shadow-lg border border-[#172a45] hover:border-[#1e4a8a] transition-all duration-200 ${
              isPending ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {/* رأس الرسالة */}
            <div className="flex flex-wrap items-baseline gap-2 mb-3">
              <h2 className="text-white font-medium text-base md:text-lg">
                {answer.author}
              </h2>
              <span className="text-gray-400 text-xs md:text-sm">
                {formatTime(answer.createdAt)}
              </span>
            </div>

            {/* النص الرئيسي مع تحسينات للقراءة */}
            <div className="text-gray-200 leading-relaxed text-start break-words whitespace-pre-wrap max-h-[300px] overflow-y-auto custom-scrollbar text-sm md:text-base">
              {answer.answer}
            </div>

            {/* زر الحذف */}
            {showDeleteButton && (
              <button
                onClick={handleToggleModal}
                disabled={isPending}
                className="absolute top-3 right-3 transition-opacity duration-200 p-1.5 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 focus:opacity-100"
                title="حذف الإجابة"
                aria-label="حذف الإجابة"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* رسالة الخطأ */}
          {isError && errorMsg && (
            <div className="mt-2 px-3 py-1.5 bg-red-900/30 border border-red-700/50 rounded-lg animate-fade-in">
              <p className="text-red-300 text-xs md:text-sm">{errorMsg}</p>
            </div>
          )}
        </div>
      </li>
    </>
  );
};

export default AnswerItem;

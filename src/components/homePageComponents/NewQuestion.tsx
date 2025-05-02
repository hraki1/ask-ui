import React, { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import profileImg from "../../assets/images/download.png";
import NewPostForm from "./NewQuestionForm";
import { createPost } from "../../http";
import UpsertPost from "../../Model/UpsertPost";
import { ImageUploadHandle } from "../UI/ImageUpload";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import { postActions } from "../../store/post";
import { authActions } from "../../store/auth";

const NewQuestion: React.FC = () => {
  const inputImageRef = useRef<ImageUploadHandle>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);
  const audio = new Audio("/new-message.mp3");

  function handlePickImage() {
    if (auth.isLoggedin) {
      inputImageRef.current?.openIamgePicker();
      setModalIsOpen((prev) => !prev);
    } else {
      navigate("/home/auth?mode=login");
    }
  }

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      if (data) {
        dispatch(postActions.add(data));
        dispatch(authActions.addPost(data));
      }
      audio.play();
    },
  });

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  function handleToggleShowModal() {
    if (auth.isLoggedin) {
      setModalIsOpen((prev) => !prev);
    } else {
      navigate("/home/auth?mode=login");
    }
  }

  function method(post: UpsertPost) {
    mutate(post);
    handleToggleShowModal();
  }

  interface InitialValuePost {
    post?: UpsertPost;
    errors: string[];
  }
  let initialValue: InitialValuePost = {
    errors: [],
  };

  return (
    <>
      <NewPostForm
        initialValue={initialValue}
        method={method}
        open={modalIsOpen}
        handleModal={handleToggleShowModal}
        ref={inputImageRef}
      />
      {/* bg-white dark:bg-slate-900 */}
      <div className=" shadow-md bg-[#1F2A40] rounded-2xl my-5">
        <div className="flex justify-between items-center p-4">
          {auth.isLoggedin && (
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={
                auth.user?.imageUrl && auth.user?.imageUrl !== ""
                  ? `${process.env.REACT_APP_ASSET_URL}/${auth.user?.imageUrl}`
                  : profileImg
              }
              alt="profile"
            />
          )}
          <input
            onClick={handleToggleShowModal}
            type="text"
            placeholder="Start a Question"
            className=" outline-none cursor-pointer flex-1 h-12 bg-gray-100 dark:bg-slate-700 text-black dark:text-white rounded-full ml-4 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-around border-t border-gray-200 dark:border-slate-700 p-3">
          <p
            onClick={handlePickImage}
            className="p-2 cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-green-600 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Photo
            </span>
          </p>

          <p
            onClick={handleToggleShowModal}
            className="p-2 cursor-pointer flex items-center hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-purple-600 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
            <span className="text-sm text-gray-700 dark:text-gray-200">
              Write Article
            </span>
          </p>
        </div>
      </div>

      <hr className="my-5 border-gray-300 dark:border-gray-700" />
    </>
  );
};

export default NewQuestion;

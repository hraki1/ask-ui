import React, { useActionState } from "react";
import profileImg from "../../assets/images/download.png";
import Post from "../../Model/Post";
import UpsertAnswer from "../../Model/UpsertAnswer";
import { useMutation } from "@tanstack/react-query";
import { createAnswer, queryClient } from "../../http";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { authActions } from "../../store/auth";
import { postActions } from "../../store/post";

const NewAnswerForm: React.FC<{ post: Post }> = ({ post }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 200);
  };
  const audio = new Audio("/new-message.mp3");

  const { mutate, isPending } = useMutation({
    mutationFn: (newAnswer: UpsertAnswer) => createAnswer(newAnswer),
    onSuccess: (newAnswer) => {
      queryClient.invalidateQueries({ queryKey: [post.id] });
      dispatch(postActions.addAnswerPost({ id: post.id, answer: newAnswer }));
      if (post.creator.id === user?.id) {
        dispatch(authActions.addAnswer({ id: post.id, answer: newAnswer }));
      }
      scrollToBottom();
      audio.play();
    },
  });

  interface ActionData {
    newAnswer?: UpsertAnswer;
    errors: string[];
  }

  async function addAnswerAction(
    prevState: ActionData,
    formData: FormData
  ): Promise<ActionData> {
    const answer = formData.get("answer") as string;

    const errors: string[] = [];

    if (answer.trim() === "") {
      errors.push("Please fill the answer of question!");
    }

    const newAnswer: UpsertAnswer = {
      answer: answer,
      creator: user?.id,
      postId: post.id,
      author: user?.name ?? "",
    };

    if (errors.length > 0) {
      return {
        newAnswer,
        errors,
      };
    }

    mutate(newAnswer);

    return {
      errors,
    };
  }

  const [formState, formAction] = useActionState(addAnswerAction, {
    errors: [],
  });

  return (
    <div className="bg-[#1E293B] w-full md:w-[50%] fixed bottom-0 left-1/2 -translate-x-1/2 flex items-start gap-3 px-4 py-4 rounded-t-xl shadow-xl z-50">
      <img
        src={
          user?.imageUrl !== ""
            ? `${process.env.REACT_APP_ASSET_URL}/${user?.imageUrl ?? ""}`
            : profileImg
        }
        className="w-12 h-12 rounded-full object-cover"
        alt="profile"
      />
      <div className="flex-1">
        <form action={formAction}>
          <input
            type="text"
            name="answer"
            placeholder="Write your answer..."
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue={formState.newAnswer?.answer}
          />
          <div className="mt-2 text-right">
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
              {isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAnswerForm;

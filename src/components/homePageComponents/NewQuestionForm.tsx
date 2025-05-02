import React, { forwardRef } from "react";
import Modal from "../UI/Modal";
import Input from "../UI/Input";
import { AnimatePresence } from "framer-motion";
import UpsertPost from "../../Model/UpsertPost";
import ImageUpload, { ImageUploadHandle } from "../UI/ImageUpload";
import { useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import { InitialState } from "../../store/auth";

interface ActionData {
  post?: UpsertPost;
  errors: string[];
}
const NewPostForm = forwardRef<
  ImageUploadHandle,
  {
    method: (post: UpsertPost) => void;
    open: boolean;
    handleModal: () => void;
    initialValue: ActionData;
  }
>(({ method, open, handleModal, initialValue }, ref) => {
  const auth = useAppSelector((state: RootState) => state.auth) as InitialState;
  const [formState, setFormState] = React.useState<ActionData>(initialValue);
  const [isPending, setIsPending] = React.useState(false);

  const includeImage = initialValue.post ? false : true;

  // 💡 Reset state whenever modal opens
  React.useEffect(() => {
    if (open) {
      setFormState(initialValue);
    }
  }, [open, initialValue]);

  const handleResetImage = () => {
    (ref as React.RefObject<ImageUploadHandle>)?.current?.reset();
  };

  const formAction = async (formData: FormData) => {
    setIsPending(true);

    const title = formData.get("title") as string;
    const question = formData.get("question") as string;
    const imageFile = formData.get("image") as File;

    const errors: string[] = [];

    if (title.trim() === "") errors.push("Please fill the title of question!");
    if (question.trim() === "") {
      errors.push("Please fill in the question!");
    } else if (question.trim().length < 6) {
      errors.push("Question must be at least 6 characters long.");
    }

    const post: UpsertPost = {
      title,
      question,
      creator: auth.user?.id,
      image: imageFile,
    };

    if (errors.length > 0) {
      setFormState({ post, errors });
      setIsPending(false);
      return;
    }

    method(post);
    handleResetImage();
    setIsPending(false);
  };

  return (
    <AnimatePresence>
      <Modal open={open}>
        <div className="p-5">
          <form action={formAction}>
            <Input
              label="Title"
              name="title"
              defaultValue={formState.post?.title}
            />
            <Input
              label="Question"
              name="question"
              isTextarea
              defaultValue={formState.post?.question}
            />
            {includeImage && (
              <ImageUpload defaultValue={formState.post?.image} ref={ref} />
            )}
            {formState.errors.length > 0 && (
              <ul className="text-red-500 p-1">
                {formState.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}
            <div className="flex gap-3 py-3">
              <button
                type="submit"
                disabled={isPending}
                className="bg-slate-950 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isPending ? "Submitting..." : "Submit"}
              </button>
              <button
                type="button"
                onClick={handleModal}
                className="bg-slate-950 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </AnimatePresence>
  );
});

export default NewPostForm;

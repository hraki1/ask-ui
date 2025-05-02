import {  XCircleIcon } from "lucide-react";
import Input from "../UI/Input";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { RootState } from "../../store";
import ImageUploadProfile from "./ImageUploadProfile";
import { useActionState } from "react";
import UpsertUser from "../../Model/UpsertUser";
import { useMutation } from "@tanstack/react-query";
import { queryClient, updatedProfile } from "../../http";
import { authActions } from "../../store/auth";

const UpdateProfileForm: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  const { mutate, data, isPending } = useMutation({
    mutationFn: (newUser: UpsertUser) => updatedProfile(newUser),
    onSuccess: (data) => {
      if (data) {
        dispatch(authActions.updateUser(data));
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });

  interface ActionData {
    newUser?: UpsertUser;
    errors: string[];
  }

  async function addAnswerAction(
    prevState: ActionData,
    formData: FormData
  ): Promise<ActionData> {
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string;
    const imageFile = formData.get("image") as File;

    const errors: string[] = [];

    if (name.trim() === "") {
      errors.push("Please fill the name");
    }

    const newUser: UpsertUser = {
      id: user?.id,
      name,
      bio,
      image: imageFile,
    };

    if (errors.length > 0) {
      return {
        newUser: {
          name,
          bio,
        },
        errors,
      };
    }

    mutate(newUser);
    closeModal();

    return {
      errors,
    };
  }

  const [formState, formAction] = useActionState(addAnswerAction, {
    errors: [],
  });

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <div>
          <XCircleIcon
            onClick={closeModal}
            className="h-9 w-9 text-gray-400 cursor-pointer hover:text-gray-600"
          />
        </div>
      </div>
      <form action={formAction}>
        <div className="flex flex-col items-center mb-4">
          <ImageUploadProfile />
        </div>

        <Input label="Name" name="name" defaultValue={user?.name} />

        <Input label="Bio" name="bio" defaultValue={user?.bio} />

        <div className="flex gap-3 py-3 justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;

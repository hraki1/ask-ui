import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import React, { useActionState, useEffect, useState } from "react";
import { Check, Eye, EyeOff } from "lucide-react"; // install via: npm i lucide-react
import { useMutation } from "@tanstack/react-query";
import { handleAuth, queryClient } from "../../http";
import { useAppDispatch } from "../../store/hooks";
import { authActions } from "../../store/auth";
import Modal from "../UI/Modal";
import Spinner from "../UI/SpinnerLoading";

interface AuthFormState {
  enteredData?: {
    email: string;
    password: string;
  };
  errors: string[];
}

const AuthForm: React.FC = () => {
  const [isloadingSpinner, setIsloadingSpinner] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{
    statusCode: number;
    message: string;
  }>({ message: "", statusCode: 0 });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const { mutate, data, error, status, isPending } = useMutation({
    mutationFn: handleAuth,
    onSuccess: (data) => {
      if (data) {
        setErrorMessage({
          statusCode: data.statusCode || 0,
          message: data.message || "",
        });
      }
      setIsloadingSpinner(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  useEffect(() => {
    if (data && data.message) {
      console.log(data);
      setErrorMessage({
        statusCode: data.statusCode || 0,
        message: data.message || "",
      });
      handleToggleModal();
    } else if (data && (data.statusCode === 201 || data.statusCode === 200)) {
      console.log(data);
      dispatch(authActions.login({ user: data.user, token: data.token }));
      navigate("..", { replace: true });
    }
  }, [data, dispatch, navigate]);

  async function authFormAction(
    prevData: AuthFormState,
    formData: FormData
  ): Promise<AuthFormState> {
    let name: string = "";
    if (!isLogin) {
      name = formData.get("name") as string;
    }
    const email: string = formData.get("email") as string;
    const password: string = formData.get("password") as string;

    const errors: string[] = [];
    if (!email.includes("@")) errors.push("Invalid email format");
    if (password.length < 6) errors.push("Password too short");

    if (errors.length > 0) {
      return {
        enteredData: { email, password },
        errors,
      };
    }

    const user = { name, email, password };
    const mode = isLogin ? "login" : "signup";
    // TODO: Send to backend or do something useful here
    mutate({ mode, user });

    return {
      errors: [],
    };
  }

  const [formState, formAction] = useActionState(authFormAction, {
    errors: [],
  });

  const handleToggleModal = () => setModalIsOpen((prev) => !prev);

  if (isloadingSpinner) {
    <Spinner />;
  }

  return (
    <>
      <Modal open={modalIsOpen}>
        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-lg w-full text-center">
          <h2 className="py-6 text-3xl font-semibold text-red-400">
            {errorMessage.message}
          </h2>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleToggleModal}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-5 rounded-xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
            >
              <Check className="w-5 h-5" />
              OK
            </button>
          </div>
        </div>
      </Modal>
      <motion.div
        className="flex justify-center items-center py-2 min-h-[calc(100vh-92px)] bg-gradient-to-br from-blue-950 via-slate-900 to-purple-900 px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <form
          action={formAction}
          className="w-full mb-24 md:mb-0  max-w-md p-8 bg-slate-800 rounded-3xl shadow-xl shadow-blue-900/40 space-y-6 text-white"
        >
          <h1 className="text-3xl font-bold text-center text-blue-400 drop-shadow">
            {isLogin ? "Log in" : "Create an Account"}
          </h1>

          {formState?.errors.length > 0 && (
            <ul className="text-red-400 text-sm list-disc pl-5">
              {formState.errors.map((error: string) => (
                <li className=" list-none text-[1rem]" key={error}>
                  {error}
                </li>
              ))}
            </ul>
          )}

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="space-y-2 text-start"
            >
              <label
                htmlFor="email"
                className="ml-1 block text-xl text-blue-200"
              >
                Name
              </label>
              <input
                disabled={isPending}
                id="name"
                type="text"
                name="name"
                className="w-full px-4 py-2 rounded-xl bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={formState.enteredData?.email}
              />
            </motion.div>
          )}

          <div className="space-y-2 text-start">
            <label htmlFor="email" className="ml-1 block text-xl text-blue-200">
              Email
            </label>
            <input
              disabled={isPending}
              id="email"
              type="text"
              name="email"
              className="w-full px-4 py-2 rounded-xl bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue={formState.enteredData?.email}
            />
          </div>

          <div className="space-y-2  text-start relative">
            <label
              htmlFor="password"
              className="ml-1 block text-xl text-blue-200"
            >
              Password
            </label>
            <div className="relative">
              <input
                disabled={isPending}
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 rounded-xl bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                defaultValue={formState.enteredData?.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-blue-300 hover:text-white focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Link
              to={`?mode=${isLogin ? "signup" : "login"}`}
              className="text-sm text-blue-300 hover:text-blue-500 transition text-[1rem]"
            >
              {isLogin ? "Create new user" : "Login"}
            </Link>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isPending}
              className="bg-blue-500 hover:bg-blue-600 transition px-6 py-2 rounded-xl text-white shadow-md shadow-blue-500/30 disabled:opacity-50"
            >
              {isPending ? "Submitting..." : isLogin ? "Log in" : "Sign up"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default AuthForm;

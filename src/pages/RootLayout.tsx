import { Outlet, useLoaderData, useSubmit } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { fetchUserById } from "../http";
import { useEffect } from "react";
import { getTokenDuration } from "../util/auth";
import { authActions } from "../store/auth";
import User from "../Model/User";

const Root = () => {
  const token = useLoaderData() as string | null;
  const submit = useSubmit();
  const dispatch = useAppDispatch();

  const fetchUser = async () => {
    const id = localStorage.getItem("userId");
    if (id) {
      const user = await fetchUserById(id);
      // console.log(user);
      return user;
    }
    throw new Error("User ID is null");
  };

  useEffect(() => {
    if (token === "EXPIRED") {
      submit(null, { action: "/home/logout", method: "post" });
      return;
    }

    if (!token) {
      return; // Guest user — no logout needed
    }

    const tokenDuration = getTokenDuration();
    // console.log(tokenDuration);

    if (token !== "EXPIRED" && token) {
      dispatch(authActions.setIsLogin());
    }

    const autoLogin = async () => {
      if (token !== "EXPIRED" && token) {
        try {
          const user = (await fetchUser()) as User;
          dispatch(authActions.autoLogin({ token, user }));
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
    };

    autoLogin();

    const logoutTimer = setTimeout(() => {
      submit(null, { action: "/logout", method: "post" });
    }, tokenDuration);

    return () => clearTimeout(logoutTimer);
  }, [token, submit, dispatch]);

  return (
    <main className="">
      <Outlet />
    </main>
  );
};

export default Root;

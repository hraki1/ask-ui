import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import profileImg from "../assets/images/download.png";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store";
import { useEffect, useRef, useState } from "react";
import CartProfile from "./profileComponents/CartProfile";

const Navigation = () => {
  const location = useLocation();

  const auth = useAppSelector((start: RootState) => start.auth);
  const notificationNumber = useAppSelector(
    (start: RootState) => start.notification.unReadNotification.length
  );

  const [showProfileCart, setShowProfileCart] = useState(false);
  const profileRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileCart(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-[100%] p-4 bg-[#1F2A40] shadow-md">
      <nav className="flex items-center justify-between">
        <div className="logo">
          <motion.h1
            className="text-2xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ASK
          </motion.h1>
        </div>

        <ul className="flex flex-1 items-center text-center justify-end px-5 md:px-20 gap-6">
          <li className="mb-1 md:mb-0 group cursor-pointer transition-all duration-300 ">
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `relative flex flex-col items-center ${
                  isActive ? "text-blue-400" : "text-blue-200"
                } transition-colors duration-300`
              }
              style={({ isActive }) => ({
                textShadow: `${isActive ? "0 0 20px #3b82f6" : "none"}`,
              })}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 md:size-6 transition-colors duration-300 group-hover:text-blue-300 hover:scale-105"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <p className="hidden  md:flex mt-1 text-xl group-hover:text-blue-300 transition-colors">
                Home
              </p>
            </NavLink>
          </li>
          {auth.isLoggedin && (
            <li className="text-blue-200 text-xl hover:text-stone-500 cursor-pointer flex items-center">
              <NavLink
                to="notification"
                style={({ isActive }) => ({
                  textShadow: isActive ? "0 0 20px #3b82f6" : "none",
                })}
                className={({ isActive }) =>
                  `flex flex-col items-center hover:text-blue-300 ${
                    isActive ? "text-blue-400" : ""
                  }`
                }
                aria-label={`Notifications: ${notificationNumber + 4} unread`}
              >
                <div className="relative flex flex-col items-center group cursor-pointer">
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-8 md:size-6 transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                      />
                    </svg>
                    {notificationNumber > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
                        {notificationNumber}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 hidden text-xl text-gray-300 md:flex group-hover:text-white transition-colors">
                    Notification
                  </p>
                </div>
              </NavLink>
            </li>
          )}

          {!auth.isLoggedin && (
            <li>
              <NavLink
                to="auth?mode=login"
                className={({ isActive }) =>
                  `${
                    isActive ? `text-blue-400 shadow-lg shadow-blue-500/50` : ""
                  } 
                  flex flex-col items-center text-blue-200 shadow shadow-blue-500/50 text-xl cursor-pointer transition-all duration-300 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/50 rounded-3xl p-1 py-1`
                }
              >
                <p className="flex justify-between items-center">
                  <button className="py-3 px-5 rounded-3xl">Sign in</button>
                </p>
              </NavLink>
            </li>
          )}

          {auth.isLoggedin && (
            <li
              ref={profileRef}
              className="text-blue-200 text-xl  transition-all duration-300 rounded-3xl p-1 py-1 relative"
              onClick={() => setShowProfileCart((prev) => !prev)}
            >
              <div className="flex flex-col cursor-pointer items-center hover:text-blue-300">
                <img
                  className="w-6 h-6 rounded-full object-cover"
                  src={
                    auth.user?.imageUrl && auth.user?.imageUrl !== ""
                      ? `${process.env.REACT_APP_ASSET_URL}/${auth.user?.imageUrl}`
                      : profileImg
                  }
                  alt=""
                />
                <div className="flex gap-1">
                  <p
                    style={{
                      textShadow: `${
                        location.pathname === "/home/profile"
                          ? "0 0 20px #3b82f6"
                          : "none"
                      }`,
                    }}
                  >
                    me
                  </p>
                  <motion.i
                    initial={{ rotate: 0 }}
                    transition={{ duration: 0.3 }}
                    animate={{ rotate: showProfileCart ? 180 : 360 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 mt-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </motion.i>
                </div>
              </div>
              <AnimatePresence>
                {showProfileCart && <CartProfile />}
              </AnimatePresence>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;

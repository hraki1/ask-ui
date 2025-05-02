import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import profileImg from "../../assets/images/download.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { authActions } from "../../store/auth";
import { RootState } from "../../store";

const CartProfile = () => {
  const auth = useAppSelector((state: RootState) => state.auth);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleLogout() {
    dispatch(authActions.logout());
    navigate("/home/auth");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -89 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -89 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute right-0 w-60 md:w-96 mt-3 bg-gradient-to-br from-[#2E3C5C] to-[#1B263B] shadow-xl text-white rounded-xl  z-50 overflow-hidden border border-slate-500"
    >
      <NavLink
        to="profile"
        className="block transition-all duration-300 ease-in-out group"
      >
        {/* Profile Section */}
        <div className="flex items-center gap-3 px-5 py-4 transition-colors">
          <img
            src={
              auth.user?.imageUrl !== ""
                ? `${process.env.REACT_APP_ASSET_URL}/${auth.user?.imageUrl ?? ""}`
                : profileImg
            }
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className=" text-[15px] md:text-xl font-semibold">
              {auth.user?.name}
            </p>
            <p className="text-sm text-gray-400 ">{auth.user?.bio}</p>
          </div>
        </div>

        {/* View Profile Button */}
        <div className=" px-5 py-3">
          <div className="w-full px-5 text-center border border-slate-400 rounded-2xl py-3 bg-slate-300 group-hover:shadow-lg group-hover:border-slate-500">
            <p className="text-base font-semibold text-slate-800 group-hover:text-slate-900 tracking-wide">
              View Profile
            </p>
          </div>
        </div>
      </NavLink>

      <div className="flex px-5">
        <div className="h-[1px] bg-gray-400 w-full "></div>
      </div>

      <div className=" flex flex-col items-start px-4 py-2  ">
        <h3 className="font-bold">Account</h3>
        <div className="text-sm flex flex-col items-start  text-slate-500">
          <p className="py-2 cursor-pointer">
            <a href="https://hraki1.github.io/portfolio/" target="blank">
              About us
            </a>
          </p>
          <p className="py-2 cursor-pointer">
            <a
              href="https://www.linkedin.com/in/ahmad-al-hraki-7ba2b2218/"
              target="blank"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>

      <div className="flex px-5">
        <div className="h-[1px] bg-gray-400 w-full "></div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex  items-center gap-3 px-5 py-4 transition-colors text-red-[#1F2A40]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"
          />
        </svg>
        <span className="text-base font-medium">Log out</span>
      </button>
    </motion.div>
  );
};

export default CartProfile;

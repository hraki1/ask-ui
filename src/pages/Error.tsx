import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Frown } from "lucide-react"; // install via: npm i lucide-react
import React from "react";
import Navigation from "../components/Navigation";

const Error: React.FC = () => {
  return (
    <>
      <Navigation />
      <motion.div
        className="flex flex-col justify-center items-center h-[calc(100vh-92px)] bg-gradient-to-br from-slate-900 via-blue-950 to-purple-900 text-white px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-center"
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Frown size={80} className="text-blue-400 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-2">404</h1>
          <p className="text-xl mb-4 text-blue-200">
            Oops! there is Error Occured Please Contact with Us and provide
            thhis error.
          </p>
          <Link
            to="/home"
            className="inline-block px-6 py-3 mt-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow shadow-blue-500/40 transition"
          >
            Go Home
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Error;

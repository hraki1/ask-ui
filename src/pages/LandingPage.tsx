import { motion, AnimatePresence } from "framer-motion";
import Feature from "../components/UI/Feature";
import Button from "../components/UI/Button";
import { Link } from "react-router-dom";
import React, { useState } from "react";

const LandingPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white flex flex-col items-center">
      {/* Header */}
      <header className="p-4 w-full fixed top-0 left-0 bg-zinc-900 shadow-md mb-10 z-50">
        <nav className=" relative flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <motion.h1
            className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 drop-shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            ASK
          </motion.h1>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-9 text-lg">
            {["Solutions", "Company", "Customer", "Partners"].map(
              (item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:text-blue-400 transition"
                >
                  {item}
                </li>
              )
            )}
          </ul>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-5xl text-white cursor-pointer"
          >
            {isOpen ? "✖" : "☰"}
          </button>

          {/* Mobile Menu (Animated) */}
          <AnimatePresence>
            {/* make animating effect still after delete element form the dom */}
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -20, x: "-50%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute left-1/2 flex top-20 
              bg-zinc-800 w-[80%] p-8 rounded-lg flex-col gap-6 
              text-center shadow-lg"
              >
                {["Solutions", "Company", "Customer", "Contact Us"].map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-xl cursor-pointer hover:text-blue-400 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </li>
                  )
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="text-center mt-28 px-6 max-w-4xl">
        <motion.h1
          className="text-6xl md:text-8xl md:mt-10 font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ask. Learn. Grow.
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl text-zinc-300 mb-10 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Unlock a world of knowledge. Join the fastest-growing Q&A platform and
          connect with experts worldwide.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-xl rounded-full shadow-lg shadow-blue-500/50">
            <Link to="home">Get Started</Link>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 px-6 max-w-6xl">
        <Feature
          title="Ask Anything"
          description="Post questions and receive insights from experts and the community."
          icon="💬"
        />
        <Feature
          title="Engage & Discuss"
          description="Upvote, comment, and join meaningful discussions on various topics."
          icon="🔥"
        />
        <Feature
          title="Grow Your Knowledge"
          description="Expand your understanding and share your expertise with others."
          icon="📚"
        />
      </section>

      {/* Call to Action */}
      <motion.section
        className="mt-32 bg-blue-600 text-white text-center py-16 px-6 w-full rounded-t-3xl shadow-lg shadow-blue-500/30"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Join the Revolution
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Don’t miss out on the opportunity to be part of a knowledge-sharing
          community. Start your journey now!
        </p>
        <Button className="bg-white text-blue-600 px-8 py-3 text-xl font-bold rounded-full shadow-lg hover:bg-gray-200">
          <Link to="signup">Sign Up Now</Link>
        </Button>
      </motion.section>
    </div>
  );
};

export default LandingPage;

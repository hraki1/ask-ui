import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { motion, useAnimate } from "framer-motion";

interface ModalProps {
  children: ReactNode;
  open: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, open }) => {
  const [scope, animate] = useAnimate();

  const modalRoot = document.getElementById("root-modal");

  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (open) {
      scope.current?.showModal();
      requestAnimationFrame(() => {
        setShouldAnimate(true);
      });
    } else {
      setShouldAnimate(false); // triggers exit animation (if needed)
      animate(scope.current, { y: 100, opacity: 0 }, { duration: 0.3 });
      setTimeout(() => {
        scope.current?.close();
      }, 300);
    }
  }, [animate, open, scope]);

  if (!modalRoot) return null;

  return createPortal(
    <motion.dialog
      id="modal"
      ref={scope}
      className="modal w-[80%] md:w-[50%] rounded-2xl  bg-slate-800 text-white shadow-2xl backdrop:bg-black/50 border border-slate-700"
      initial={{ y: 100, opacity: 0 }}
      animate={shouldAnimate ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
      transition={{ duration: 0.5 }}
      exit={!shouldAnimate ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
    >
      {children}
    </motion.dialog>,
    modalRoot
  );
};

export default Modal;

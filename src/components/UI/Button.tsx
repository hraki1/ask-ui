import React from "react";

interface ButtonProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode; // Explicitly define children
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  onClick,
  children,
}) => (
  <button className={`px-4 py-2 rounded ${className}`} onClick={onClick}>
    {children}
  </button>
);

export default Button;

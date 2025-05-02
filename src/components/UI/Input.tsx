import { ReactNode } from "react";

interface InputProps {
  label: string;
  name: string;
  isTextarea?: boolean;
  type?: string;
  children?: ReactNode;
  defaultValue?: string;
}

const Input: React.FC<InputProps> = ({
  children,
  label,
  name,
  type = "text",
  isTextarea = false,
  defaultValue = "",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name}>{label}</label>
      {!isTextarea ? (
        <input
          id={name}
          type={type}
          name={name}
          defaultValue={defaultValue}
          className="outline-none p-2 border rounded bg-zinc-200 text-zinc-900"
        />
      ) : (
        <textarea
          id={name}
          name={name}
          defaultValue={defaultValue}
          className="outline-none p-2 border rounded text-zinc-900"
        ></textarea>
      )}
    </div>
  );
};

export default Input;

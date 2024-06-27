import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode | React.ReactNode[];
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  className = "",
  active,
  icon,
  children,
  ...rest
}) => {
  const baseClassName = `flex text-dark/80 flex-row items-center w-full rounded-md border-none bg-[transparent] px-4 py-3 text-base font-medium outline-none hover:cursor-pointer`;

  const activeClassName = active
    ? `main-gradient text-white hover:!main-gradient bg-[#1C1F26]`
    : "";

  return (
    <button
      type="button"
      className={`${baseClassName} ${className} ${activeClassName}`}
      {...rest}
    >
      {icon && (
        <div className="mr-3 flex flex-row items-center text-xl">{icon}</div>
      )}
      <div>{children}</div>
    </button>
  );
};

export default Button;

import { cn } from "../utils";

type ButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "error";
};

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, variant = "primary" }) => {
  return (
    <div
      className={cn(
        "rounded-md px-5 py-2 text-sm font-semibold text-on-error shadow-sm transition hover:opacity-80 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        variant === "primary" && "bg-primary text-on-primary",
        variant === "secondary" && "bg-secondary text-on-secondary",
        variant === "error" && "bg-error text-on-error"
      )}
      onClick={onClick}
    >
      {label.toUpperCase()}
    </div>
  );
};

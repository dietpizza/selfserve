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
        "rounded-xl px-5 py-2.5 transition-all text-sm font-semibold text-on-error shadow-sm hover:opacity-80 cursor-pointer",
        disabled && "opacity-50 cursor-not-allowed",
        variant === "primary" && "bg-primary text-on-primary",
        variant === "secondary" && "bg-surface-variant text-on-surface-variant",
        variant === "error" && "bg-error text-on-error"
      )}
      onClick={onClick}
    >
      {label.toUpperCase()}
    </div>
  );
};

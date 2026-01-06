import React from "react";

interface CustomButtonProps extends React.ComponentProps<"button"> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  variant = "primary",
  onClick,
  className = "",
  type = "button",
  disabled = false,
  style,
}) => {
  const baseStyles =
    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex justify-center items-center";

  const variants = {
    primary:
      "bg-primary/20 text-primary hover:bg-primary/30 active:scale-[0.98]",
    secondary:
      "bg-muted/40 text-foreground hover:bg-muted/60 active:scale-[0.98]",
    danger:
      "bg-red-400/20 text-red-400 hover:bg-red-400/30 active:scale-[0.98]",
    success:
      "bg-green-400/20 text-green-400 hover:bg-green-400/30 active:scale-[0.98]",
  };

  return (
    <button
      style={{
        ...style,
        paddingInline: style?.paddingInline || "8px",
        paddingBlock: style?.paddingBottom || "6px",
        borderRadius: style?.borderRadius || "5px",
      }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} px-2 text-sm py-0.5`}
    >
      {children}
    </button>
  );
};

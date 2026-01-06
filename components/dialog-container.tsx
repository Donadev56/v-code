import React from "react";

interface DialogContainerProps {
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const DialogContainer: React.FC<DialogContainerProps> = ({
  title,
  children,
  actions,
  className = "",
}) => {
  return (
    <div
      className={`bg-card w-full max-w-md border rounded shadow-lg ${className}`}
    >
      <div className="p-5 flex flex-col gap-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <div className="space-y-4">{children}</div>
        {actions && <div className="pt-2">{actions}</div>}
      </div>
    </div>
  );
};

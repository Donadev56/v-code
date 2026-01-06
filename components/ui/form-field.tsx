import React from "react";

interface FormFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <div className="w-full rounded bg-muted/40">
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={`w-full bg-transparent rounded-lg px-2 py-1.5 text-sm focus:outline-none  ${className}`}
        />
      </div>
    </div>
  );
};

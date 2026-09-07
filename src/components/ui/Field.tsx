"use client";

import { useId } from "react";
import { WarningCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}

/** Label above, hint below, error below with icon. Never placeholder-as-label. */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-danger">
          <WarningCircle size={15} weight="fill" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[13px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field-input", className)} {...props} />;
}

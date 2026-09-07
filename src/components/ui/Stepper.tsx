"use client";

import { Minus, Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface StepperProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  label: string;
}

export function Stepper({ value, onChange, min = 0, max = 9, label }: StepperProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-hairline-firm bg-canvas">
      <StepButton
        aria-label={`Remove one ${label}`}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={15} />
      </StepButton>
      <span
        data-numeric
        className="min-w-[2ch] text-center text-[15px] font-medium text-ink tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <StepButton
        aria-label={`Add one ${label}`}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={15} />
      </StepButton>
    </div>
  );
}

function StepButton({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "grid h-11 w-11 place-items-center rounded-full text-body transition-colors",
        "hover:text-ink hover:bg-canvas-soft disabled:text-faint disabled:hover:bg-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

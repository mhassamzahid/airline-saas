"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-medium transition-colors select-none disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-rust-700 text-on-rust shadow-[0_2px_5px_rgba(74,31,10,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] hover:bg-rust-600 active:translate-y-px active:shadow-[0_1px_2px_rgba(74,31,10,0.3)] disabled:bg-canvas-sink disabled:text-faint disabled:shadow-none disabled:hover:bg-canvas-sink disabled:active:translate-y-0",
  secondary:
    "bg-canvas text-ink border border-hairline-firm hover:bg-canvas-soft active:translate-y-px disabled:text-faint disabled:hover:bg-canvas",
  ghost:
    "text-body hover:text-ink hover:bg-canvas-soft active:translate-y-px disabled:text-faint disabled:hover:bg-transparent",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  sm: "h-9 px-3.5 text-[13px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className, children, ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.12 }}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
});

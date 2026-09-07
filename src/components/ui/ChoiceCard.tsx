"use client";

import { motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  selected: boolean;
  onSelect: () => void;
  className?: string;
  children: React.ReactNode;
  /** Renders as a real radio for keyboard semantics. */
  name: string;
  value: string;
}

export function ChoiceCard({
  selected,
  onSelect,
  className,
  children,
  name,
  value,
}: ChoiceCardProps) {
  return (
    <motion.label
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "group relative block cursor-pointer rounded-[10px] border p-4 transition-all",
        selected
          ? "is-selected bg-canvas"
          : "border-hairline-firm bg-canvas-soft hover:-translate-y-0.5 hover:bg-canvas hover:h-shadow-md",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      {children}
      <CheckCircle
        weight="fill"
        size={20}
        className={cn(
          "absolute right-3 top-3 text-rust-700 transition-opacity",
          selected ? "opacity-100" : "opacity-0",
        )}
      />
    </motion.label>
  );
}

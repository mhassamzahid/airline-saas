"use client";

import { motion } from "motion/react";
import { CheckCircle } from "@phosphor-icons/react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

interface PhotoCardProps {
  image: string;
  alt: string;
  selected: boolean;
  onSelect: () => void;
  /** radio group name (single-select) or, with `multi`, the checkbox name */
  name: string;
  value: string;
  /** render as a checkbox (multi-select toggle) instead of a radio */
  multi?: boolean;
  /** aspect ratio class for the image, e.g. "aspect-[4/5]" */
  imageAspect?: string;
  /** overlaid on the bottom of the image, over a dark gradient */
  overlay?: React.ReactNode;
  /** solid strip below the image */
  footer?: React.ReactNode;
  className?: string;
}

export function PhotoCard({
  image,
  alt,
  selected,
  onSelect,
  name,
  value,
  multi = false,
  imageAspect = "aspect-[4/5]",
  overlay,
  footer,
  className,
}: PhotoCardProps) {
  return (
    <motion.label
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.12 }}
      className={cn(
        "group relative block cursor-pointer overflow-hidden rounded-[12px] border bg-canvas transition-all",
        selected
          ? "is-selected"
          : "border-hairline hover:-translate-y-1 hover:h-shadow-md",
        className,
      )}
    >
      <input
        type={multi ? "checkbox" : "radio"}
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      <Photo src={image} alt={alt} className={cn("w-full", imageAspect)}>
        <div
          className="photo-caption absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,32,31,0.9) 0%, rgba(20,32,31,0.45) 26%, rgba(20,32,31,0) 52%)",
          }}
        />
        {overlay && (
          <div className="photo-caption absolute inset-x-0 bottom-0 p-4 text-on-dark">
            {overlay}
          </div>
        )}
        <CheckCircle
          weight="fill"
          size={26}
          className={cn(
            "photo-caption absolute right-3 top-3 text-rust-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] transition-opacity",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
      </Photo>

      {footer && <div className="border-t border-hairline bg-canvas p-4">{footer}</div>}
    </motion.label>
  );
}

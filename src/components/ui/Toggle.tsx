"use client";

import * as Switch from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
  description?: string;
  price?: string;
  icon?: React.ReactNode;
}

export function ToggleRow({
  checked,
  onChange,
  title,
  description,
  price,
  icon,
}: ToggleRowProps) {
  const id = title.replace(/\s+/g, "-").toLowerCase();
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[10px] border p-4 transition-colors",
        checked ? "is-selected bg-canvas" : "border-hairline-firm bg-canvas-soft",
      )}
    >
      {icon && <div className="mt-0.5 shrink-0 text-rust-700">{icon}</div>}
      <div className="min-w-0 flex-1">
        {/* Switch sits beside the title, not the price -- a row with title +
            price + switch all fighting for space is what squeezed the title
            column down to one word per line on narrow phones (the longer
            "per person, per day" price labels made it worse). The price now
            gets its own full-width line below, so nothing has to shrink. */}
        <div className="flex items-start justify-between gap-3">
          <label htmlFor={id} className="text-[15px] font-medium text-ink">
            {title}
          </label>
          <Switch.Root
            id={id}
            checked={checked}
            onCheckedChange={onChange}
            className={cn(
              "relative h-6 w-10 shrink-0 rounded-full border transition-colors",
              "data-[state=checked]:border-rust-700 data-[state=checked]:bg-rust-700",
              "data-[state=unchecked]:border-hairline-firm data-[state=unchecked]:bg-canvas-sink",
            )}
          >
            <Switch.Thumb
              className={cn(
                "block h-[18px] w-[18px] translate-x-0.5 rounded-full bg-canvas h-shadow-sm transition-transform",
                "data-[state=checked]:translate-x-[19px]",
              )}
            />
          </Switch.Root>
        </div>
        {description && (
          <p className="mt-0.5 text-[13px] text-muted">{description}</p>
        )}
        {price && (
          <p data-numeric className="mt-1.5 text-[13px] text-body">
            {price}
          </p>
        )}
      </div>
    </div>
  );
}

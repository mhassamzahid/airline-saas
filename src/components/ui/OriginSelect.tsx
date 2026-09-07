"use client";

import * as Select from "@radix-ui/react-select";
import { CaretDown, Check, MapPin } from "@phosphor-icons/react";
import { ORIGINS } from "@/data/airports";
import { cn } from "@/lib/utils";

interface OriginSelectProps {
  value: string;
  onChange: (code: string) => void;
  labelId?: string;
}

export function OriginSelect({ value, onChange, labelId }: OriginSelectProps) {
  const selected = ORIGINS.find((o) => o.code === value) ?? ORIGINS[0];

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        aria-labelledby={labelId}
        className={cn(
          "flex h-11 min-w-[220px] items-center gap-2 rounded-[10px] border border-hairline-firm bg-canvas-soft px-3 text-left",
          "data-[state=open]:border-rust-500 data-[state=open]:shadow-[0_0_0_3px_rgba(221,101,49,0.14)]",
        )}
      >
        <MapPin size={16} className="shrink-0 text-rust-700" weight="fill" />
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          <span data-numeric className="text-[15px] font-medium text-ink">
            {selected.code}
          </span>
          <span className="truncate text-[13px] text-muted">{selected.city}</span>
        </span>
        <Select.Icon>
          <CaretDown size={14} className="text-muted" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-50 w-[min(320px,var(--radix-select-trigger-width))] overflow-hidden rounded-[10px] border border-hairline bg-canvas h-shadow-md"
        >
          <Select.Viewport className="p-1.5">
            {ORIGINS.map((o) => (
              <Select.Item
                key={o.code}
                value={o.code}
                className={cn(
                  "flex cursor-pointer flex-col gap-0.5 rounded-[8px] px-2.5 py-2 text-[14px] outline-none",
                  "data-[highlighted]:bg-canvas-soft data-[state=checked]:text-rust-700",
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <Select.ItemText>
                    <span className="flex items-baseline gap-2">
                      <span data-numeric className="font-medium">{o.code}</span>
                      <span className="text-muted">{o.name}</span>
                    </span>
                  </Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={14} weight="bold" />
                  </Select.ItemIndicator>
                </span>
                <span className="text-[12px] text-muted">{o.note}</span>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

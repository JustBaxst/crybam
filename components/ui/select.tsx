"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";

export function Select({
  value,
  onChange,
  options,
  placeholder = "Выберите...",
  className = "",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-background hover:bg-surface/50 focus:border-accent outline-none transition-colors text-sm text-left ${className}`}
        >
          <span className={selected ? "text-foreground" : "text-muted"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-muted shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-1 max-h-60 overflow-y-auto"
        align="start"
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md hover:bg-accent/10 hover:text-accent transition-colors text-left"
          >
            {opt.label}
            {value === opt.value && (
              <Check className="w-3.5 h-3.5 text-accent" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

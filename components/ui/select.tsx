"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

export function Select({
  value,
  onChangeAction,
  options,
  placeholder = "Выберите...",
  className = "",
  disabled = false,
}: {
  value: string;
  onChangeAction: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border bg-background hover:bg-surface/50 focus:border-accent outline-none transition-colors text-sm text-left cursor-pointer ${className}`}
        >
          <span className={selected ? "text-foreground" : "text-muted"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-muted shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) max-h-60 overflow-y-auto p-1 z-150"
        align="start"
      >
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChangeAction(opt.value)}
            className="flex items-center justify-between cursor-pointer"
          >
            {opt.label}
            {value === opt.value && (
              <Check className="w-3.5 h-3.5 text-accent" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

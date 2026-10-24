"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function ActionDropdown({
  editHref,
  onDeleteClick,
}: {
  editHref: string;
  onDeleteClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-md border border-border hover:border-accent/40 hover:text-accent flex items-center justify-center transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-50">
          <Link
            href={editHref}
            className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-foreground/5 transition-colors"
          >
            <Pencil className="w-4 h-4 text-muted" />
            Редактировать
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              onDeleteClick();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-border"
          >
            <Trash2 className="w-4 h-4" />
            Удалить
          </button>
        </div>
      )}
    </div>
  );
}
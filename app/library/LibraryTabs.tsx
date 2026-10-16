"use client";

import Link from "next/link";

export type LibraryStatus =
  | "watched"
  | "watching"
  | "planned"
  | "on_hold"
  | "dropped";

const TABS: { key: LibraryStatus; label: string }[] = [
  { key: "watched",  label: "Просмотрено" },
  { key: "watching", label: "Смотрю" },
  { key: "planned",  label: "В планах" },
  { key: "on_hold",  label: "Отложено" },
  { key: "dropped",  label: "Брошено" },
];

export function LibraryTabs({
  active,
  counts,
  view,
}: {
  active: LibraryStatus;
  counts: Record<LibraryStatus, number>;
  view: "grid" | "list";
}) {
  return (
    <div className="border-b border-border">
      <nav className="flex gap-1 -mb-px overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = tab.key === active;
          return (
            <Link
              key={tab.key}
              href={`/library?status=${tab.key}&view=${view}`}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground hover:border-border"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "bg-border/40 text-muted"
                }`}
              >
                {counts[tab.key]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
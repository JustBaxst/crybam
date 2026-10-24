"use client";

import Link from "next/link";
import { Grid3x3, List } from "lucide-react";
import type { LibraryStatus } from "./LibraryTabs";

export function LibraryViewToggle({
  view,
  activeStatus,
}: {
  view: "grid" | "list";
  activeStatus: LibraryStatus;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-surface p-0.5">
      <Link
        href={`/library?status=${activeStatus}&view=grid`}
        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${view === "grid"
          ? "bg-accent/15 text-accent"
          : "text-muted hover:text-foreground"
          }`}
        aria-label="Сетка"
        title="Сетка"
      >
        <Grid3x3 className="w-4 h-4" />
      </Link>
      <Link
        href={`/library?status=${activeStatus}&view=list`}
        className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${view === "list"
          ? "bg-accent/15 text-accent"
          : "text-muted hover:text-foreground"
          }`}
        aria-label="Список"
        title="Список"
      >
        <List className="w-4 h-4" />
      </Link>
    </div>
  );
}
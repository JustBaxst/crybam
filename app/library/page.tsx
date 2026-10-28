import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { isCryTag } from "@/lib/cry-tags";
import { DramaCard } from "@/components/DramaCard";
import { DramaListItem } from "@/components/DramaListItem";
import { LibraryTabs, type LibraryStatus } from "./LibraryTabs";
import { LibraryViewToggle } from "./LibraryViewToggle";

const VALID_STATUSES: LibraryStatus[] = [
  "watched",
  "watching",
  "planned",
  "on_hold",
  "dropped",
];

type SearchParams = Promise<{ status?: string; view?: string }>;

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status: rawStatus, view: rawView } = await searchParams;

  const activeStatus: LibraryStatus = VALID_STATUSES.includes(
    rawStatus as LibraryStatus
  )
    ? (rawStatus as LibraryStatus)
    : "watched";

  const view: "grid" | "list" = rawView === "list" ? "list" : "grid";

  const countsRaw = await prisma.userDramaEntry.groupBy({
    by: ["status"],
    where: { userId: CURRENT_USER_ID },
    _count: { _all: true },
  });

  const counts: Record<LibraryStatus, number> = {
    watched: 0,
    watching: 0,
    planned: 0,
    on_hold: 0,
    dropped: 0,
  };
  for (const row of countsRaw) {
    if (VALID_STATUSES.includes(row.status as LibraryStatus)) {
      counts[row.status as LibraryStatus] = row._count._all;
    }
  }

  const entries = await prisma.userDramaEntry.findMany({
    where: {
      userId: CURRENT_USER_ID,
      drama: {
        deletedAt: null,
        status: activeStatus
      }
    },
    include: { drama: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Библиотека</h1>

      <div className="flex items-end justify-between gap-4 mb-0">
        <div className="flex-1 min-w-0">
          <LibraryTabs active={activeStatus} counts={counts} view={view} />
        </div>
        <div className="pb-2 shrink-0">
          <LibraryViewToggle view={view} activeStatus={activeStatus} />
        </div>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted mt-8">Здесь пока пусто.</p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-8">
          {entries.map((entry) => (
            <DramaCard
              key={entry.id}
              dramaId={entry.drama.id}
              title={entry.drama.title}
              year={entry.drama.year ?? 0}
              country={entry.drama.country ?? "—"}
              rating={entry.rating ?? 0}
              cryTag={isCryTag(entry.cryTag) ? entry.cryTag : undefined}
              status={entry.status}
              impression={entry.impression}
              posterUrl={entry.drama.posterUrl}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-6">
          {entries.map((entry) => (
            <DramaListItem
              key={entry.id}
              dramaId={entry.drama.id}
              title={entry.drama.title}
              year={entry.drama.year ?? 0}
              country={entry.drama.country ?? "—"}
              rating={entry.rating ?? 0}
              cryTag={isCryTag(entry.cryTag) ? entry.cryTag : undefined}
              status={entry.status}
              posterUrl={entry.drama.posterUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
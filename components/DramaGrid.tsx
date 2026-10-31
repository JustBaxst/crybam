import { DramaCard } from "@/components/DramaCard";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { isCryTag } from "@/lib/cry-tags";

export async function DramaGrid() {

  const entries = await prisma.userDramaEntry.findMany({
    where: {
      userId: CURRENT_USER_ID,
      drama: { deletedAt: null },
    },
    include: { drama: true },
    orderBy: { createdAt: "desc" },
  });

  if (entries.length === 0) {
    return (
      <p className="text-muted">
        Пока пусто. Запусти <code className="text-accent">npx prisma studio</code> и добавь первую дораму.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
  );
}
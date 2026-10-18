import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  Film,
  User as UserIcon,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export default async function PersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      credits: {
        include: {
          drama: true,
          character: true,
        },
      },
    },
  });

  if (!person) notFound();

  const filmography = [...person.credits].sort((a, b) => {
    const ya = a.drama.year ?? 0;
    const yb = b.drama.year ?? 0;
    return yb - ya;
  });

  const age = person.birthDate
    ? Math.floor(
        (Date.now() - new Date(person.birthDate).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/people"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Все актёры
      </Link>

      {/* Шапка */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-accent-soft flex items-center justify-center text-6xl shrink-0 overflow-hidden">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-16 h-16 text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold leading-tight">{person.name}</h1>

          {person.nameNative && (
            <p className="text-sm text-muted mt-1">{person.nameNative}</p>
          )}

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-muted">
            {person.birthDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-accent" />
                {new Date(person.birthDate).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {age !== null && (
                  <span className="text-muted/70">({age})</span>
                )}
              </span>
            )}
            {person.agency && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-accent" />
                {person.agency}
              </span>
            )}
          </div>

          {person.bio && (
            <p className="text-sm text-muted mt-5 leading-relaxed whitespace-pre-wrap">
              {person.bio}
            </p>
          )}
        </div>
      </div>

      {/* Фильмография */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
          <Film className="w-5 h-5 text-accent" />
          Фильмография
          <span className="text-sm text-muted font-normal">
            ({filmography.length})
          </span>
        </h2>

        {filmography.length === 0 ? (
          <p className="text-sm text-muted italic">
            Актёр пока не привязан ни к одной дораме
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filmography.map((c) => (
              <Link
                key={c.id}
                href={`/dramas/${c.drama.id}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 hover:border-accent/50 transition-colors"
              >
                <div className="w-14 h-20 rounded-lg overflow-hidden bg-accent-soft/40 flex items-center justify-center text-2xl shrink-0">
                  {c.drama.posterUrl ? (
                    <img
                      src={c.drama.posterUrl}
                      alt={c.drama.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted">🎬</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">
                    {c.drama.title}
                  </p>
                  {c.drama.year && (
                    <p className="text-xs text-muted mt-0.5">
                      {c.drama.year}
                    </p>
                  )}

                  {c.character?.name && (
                    <p className="text-xs text-accent mt-1 truncate">
                      → {c.character.name}
                    </p>
                  )}
                  {c.character?.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">
                      {c.character.description}
                    </p>
                  )}

                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {c.importance === "lead" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                        Главная
                      </span>
                    )}
                    {c.importance === "guest" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-border text-muted">
                        Эпизод
                      </span>
                    )}
                    {c.roleType !== "actor" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-border text-muted">
                        {roleLabel(c.roleType)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function roleLabel(roleType: string) {
  const map: Record<string, string> = {
    director: "Режиссёр",
    writer: "Сценарист",
  };
  return map[roleType] ?? roleType;
}
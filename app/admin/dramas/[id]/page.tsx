import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Film,
  Tag as TagIcon,
  Users,
  Video,
  Calendar,
  MapPin,
  Clock,
  Languages,
  Tv,
  Layers,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EditDramaButton } from "../../../dramas/[id]/EditDramaButton";
import { GenresEditButton } from "../../../dramas/[id]/GenresEditButton";
import { CreditsEditButton } from "../../../dramas/[id]/CreditsEditButton";
import { DeleteDramaButton } from "../DeleteDramaButton";

type Params = Promise<{ id: string }>;

export default async function AdminDramaEditPage({
  params,
}: {
  params: Params;
}) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const drama = await prisma.drama.findUnique({
    where: { id },
    include: {
      titles: { orderBy: { isPrimary: "desc" } },
      platforms: { include: { platform: true } },
      studios: { include: { studio: true } },
      genres: { include: { genre: true } },
      credits: {
        include: { person: true, character: true },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!drama) notFound();

  const allGenres = await prisma.genre.findMany({
    orderBy: { name: "asc" },
  });

  const allPersons = await prisma.person.findMany({
    orderBy: { name: "asc" },
    select: { name: true },
  });

  const linkedGenreIds = drama.genres.map((g) => g.genre.id);

  const importanceOrder: Record<string, number> = {
    lead: 0,
    support: 1,
    guest: 2,
  };

  const actors = drama.credits
    .filter((c) => c.roleType === "actor")
    .sort((a, b) => {
      const ai = importanceOrder[a.importance] ?? 1;
      const bi = importanceOrder[b.importance] ?? 1;
      if (ai !== bi) return ai - bi;
      return (a.order ?? 999) - (b.order ?? 999);
    });

  const directors = drama.credits.filter((c) => c.roleType === "director");
  const writers = drama.credits.filter((c) => c.roleType === "writer");

  const genres = drama.genres.map((g) => g.genre.name);
  const platforms = drama.platforms.map((p) => p.platform.name);
  const productionStudios = drama.studios.map((s) => s.studio.name);

  const externalRatings = [
    { name: "Кинопоиск", value: drama.ratingKinopoisk },
    { name: "MyDramaList", value: drama.ratingMDL },
    { name: "IMDb", value: drama.ratingIMDB },
    { name: "Douban", value: drama.ratingDouban },
  ].filter((r) => r.value != null);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/admin/dramas"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку
      </Link>

      {/* Заголовок с действиями */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight">
            {drama.title}
          </h1>
          <p className="text-sm text-muted mt-1">
            ID: {drama.id} · Редактирование фактов
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <EditDramaButton
            dramaId={drama.id}
            drama={{
              title: drama.title,
              year: drama.year,
              country: drama.country,
              episodes: drama.episodes,
              seasons: drama.seasons,
              episodeDuration: drama.episodeDuration,
              synopsis: drama.synopsis,
              posterUrl: drama.posterUrl,
              airedFrom: drama.airedFrom,
              airedTo: drama.airedTo,
              ratingKinopoisk: drama.ratingKinopoisk,
              ratingMDL: drama.ratingMDL,
              ratingIMDB: drama.ratingIMDB,
              ratingDouban: drama.ratingDouban,
              dubbingStudios: drama.dubbingStudios,
            }}
          />
          <DeleteDramaButton dramaId={drama.id} dramaTitle={drama.title} />
        </div>
      </div>

      {/* Основные факты */}
      <section className="rounded-2xl border border-border bg-surface p-6 mb-6">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wide mb-4">
          Факты
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <FactRow Icon={Calendar} label="Год" value={drama.year} />
          <FactRow Icon={MapPin} label="Страна" value={drama.country} />
          <FactRow Icon={Film} label="Серий" value={drama.episodes} />
          <FactRow Icon={Layers} label="Сезонов" value={drama.seasons} />
          <FactRow
            Icon={Clock}
            label="Длительность"
            value={
              drama.episodeDuration ? `${drama.episodeDuration} мин` : null
            }
          />
          <FactRow
            Icon={Languages}
            label="Озвучка"
            value={drama.dubbingStudios}
          />
          <FactRow
            Icon={Tv}
            label="Платформы"
            value={platforms.join(", ") || null}
          />
          <FactRow
            Icon={Video}
            label="Производство"
            value={productionStudios.join(", ") || null}
          />
        </div>

        {externalRatings.length > 0 && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted mb-2">Внешние рейтинги</p>
            <div className="flex flex-wrap gap-2">
              {externalRatings.map((r) => (
                <span
                  key={r.name}
                  className="text-xs px-2 py-1 rounded-md border border-border bg-background"
                >
                  <span className="text-muted">{r.name}:</span>{" "}
                  <span className="font-semibold">{r.value?.toFixed(1)}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Жанры */}
      <section className="rounded-2xl border border-border bg-surface p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide flex items-center gap-2">
            <TagIcon className="w-4 h-4" />
            Жанры
          </h2>
          <GenresEditButton
            dramaId={drama.id}
            allGenres={allGenres}
            linkedGenreIds={linkedGenreIds}
          />
        </div>

        {genres.length === 0 ? (
          <p className="text-xs text-muted/70 italic">
            Жанры пока не заполнены
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <span
                key={g}
                className="text-sm px-3 py-1 rounded-full border border-border text-muted"
              >
                {g}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Съёмочная группа */}
      <section className="rounded-2xl border border-border bg-surface p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide flex items-center gap-2">
            <Video className="w-4 h-4" />
            Съёмочная группа
          </h2>
          <CreditsEditButton
            dramaId={drama.id}
            credits={drama.credits.map((c) => ({
              id: c.id,
              roleType: c.roleType,
              personName: c.person.name,
              characterName: c.character?.name ?? null,
              characterDescription: c.character?.description ?? null,
              importance: c.importance,
            }))}
            existingPersons={allPersons.map((p) => p.name)}
          />
        </div>

        {directors.length === 0 && writers.length === 0 ? (
          <p className="text-xs text-muted/70 italic">
            Режиссёр и сценаристы пока не заполнены
          </p>
        ) : (
          <div className="space-y-1.5 text-sm">
            {directors.length > 0 && (
              <p>
                <span className="text-muted">Режиссёр:</span>{" "}
                <span className="text-foreground">
                  {directors.map((d) => d.person.name).join(", ")}
                </span>
              </p>
            )}
            {writers.length > 0 && (
              <p>
                <span className="text-muted">Сценаристы:</span>{" "}
                <span className="text-foreground">
                  {writers.map((w) => w.person.name).join(", ")}
                </span>
              </p>
            )}
          </div>
        )}
      </section>

      {/* Актёры и персонажи */}
      <section className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted uppercase tracking-wide flex items-center gap-2">
            <Users className="w-4 h-4" />
            Актёры и персонажи
          </h2>
          <CreditsEditButton
            dramaId={drama.id}
            credits={drama.credits.map((c) => ({
              id: c.id,
              roleType: c.roleType,
              personName: c.person.name,
              characterName: c.character?.name ?? null,
              characterDescription: c.character?.description ?? null,
              importance: c.importance,
            }))}
            existingPersons={allPersons.map((p) => p.name)}
          />
        </div>

        {actors.length === 0 ? (
          <p className="text-xs text-muted/70 italic">
            Актёры пока не заполнены
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {actors.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 rounded-xl border border-border bg-background p-3 border-l-4 ${importanceBorderColor(a.importance)}`}
              >
                <div className="w-10 h-10 rounded-full bg-accent-soft/50 flex items-center justify-center text-lg shrink-0">
                  👤
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">
                      {a.person.name}
                    </p>
                    {a.importance === "lead" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                        Главная
                      </span>
                    )}
                  </div>
                  {a.character?.name && (
                    <p className="text-xs text-accent mt-0.5 truncate">
                      → {a.character.name}
                    </p>
                  )}
                  {a.character?.description && (
                    <p className="text-xs text-muted mt-0.5 line-clamp-2">
                      {a.character.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FactRow({
  Icon,
  label,
  value,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-foreground truncate">
          {value ?? <span className="text-muted/50">—</span>}
        </p>
      </div>
    </div>
  );
}

function importanceBorderColor(importance: string) {
  switch (importance) {
    case "lead":
      return "border-l-yellow-400/70";
    case "support":
      return "border-l-accent/50";
    case "guest":
      return "border-l-border";
    default:
      return "border-l-border";
  }
}
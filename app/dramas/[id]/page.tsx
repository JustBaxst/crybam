import Link from "next/link";
import { notFound } from "next/navigation";
import { EditEntryButton } from "./EditEntryButton";
import { AlternativeTitles } from "./AlternativeTitles";
import { PosterImage } from "@/components/PosterImage";
import {
  ArrowLeft,
  Star,
  Calendar,
  MapPin,
  Film,
  Tv,
  Quote,
  Crown,
  BookOpen,
  NotebookPen,
  Users,
  Music,
  Tag as TagIcon,
  Plus,
  Eye,
  Clock,
  PlayCircle,
  Video,
  Languages,
  Award,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { isCryTag } from "@/lib/cry-tags";
import { CryBadge } from "@/components/CryBadge";
import { QuickStatusButtons } from "./QuickStatusButtons";
import { SoundtrackPlayer } from "./SoundtrackPlayer";

type Params = Promise<{ id: string }>;

export default async function DramaPage({ params }: { params: Params }) {
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
      soundtrack: { orderBy: { id: "asc" } },
      nominations: { include: { nomination: true } },
    },
  });

  if (!drama) notFound();

  const entry = await prisma.userDramaEntry.findFirst({
    where: { userId: CURRENT_USER_ID, dramaId: id },
  });

  const mainTitle = drama.titles.find((t) => t.isPrimary)?.title ?? drama.title;
  const altTitles = drama.titles.filter((t) => !t.isPrimary);
  const platforms = drama.platforms.map((p) => p.platform.name);
  const productionStudios = drama.studios.map((s) => s.studio.name);
  const genres = drama.genres.map((g) => g.genre.name);

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

  const externalRatings = [
    { name: "Кинопоиск", value: drama.ratingKinopoisk },
    { name: "MyDramaList", value: drama.ratingMDL },
    { name: "IMDb", value: drama.ratingIMDB },
    { name: "Douban", value: drama.ratingDouban },
  ].filter((r) => r.value != null);

  const formatDate = (d: Date | null) =>
    d
      ? new Date(d).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <Link
        href="/library"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад в библиотеку
      </Link>

      {/* ─── ШАПКА ─── */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-56 shrink-0 mx-auto md:mx-0">
          <div className="aspect-2/3 rounded-2xl overflow-hidden border border-border bg-accent-soft flex items-center justify-center text-6xl">
            {drama.posterUrl ? (
              <img
                src={drama.posterUrl}
                alt={mainTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted">🎬</span>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold leading-tight">{mainTitle}</h1>

          {/* Другие названия */}
          <AlternativeTitles titles={altTitles} />

          {/* Совет редактора (если записи нет) */}
          {!entry && isCryTag(drama.curatorCryTag) && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs text-muted">Совет редактора:</span>
              <CryBadge tag={drama.curatorCryTag} size="md" />
            </div>
          )}

          {/* Факты, даты, каналы и озвучка */}
          <div className="mt-5 flex flex-col gap-y-2.5 text-sm text-muted">
            {/* Первая строка: год, страна, серии и длительность */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {drama.year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-muted/70">Год:</span>
                  {drama.year}
                </span>
              )}
              {drama.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-muted/70">Страна:</span>
                  {drama.country}
                </span>
              )}
              {drama.episodes && (
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-accent" />
                  <span className="text-muted/70">Серий:</span>
                  {drama.episodes}
                </span>
              )}
              {drama.seasons && (
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-accent" />
                  <span className="text-muted/70">Сезонов:</span>
                  {drama.seasons}
                </span>
              )}
              {drama.episodeDuration && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-muted/70">Длительность:</span>
                  ~{drama.episodeDuration} мин
                </span>
              )}

              {drama.airStatus === "ongoing" && (
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  Выходит сейчас
                </span>
              )}
              {drama.airStatus === "announced" && (
                <span className="text-muted border border-border px-2 py-0.5 rounded-full text-xs">
                  Анонс
                </span>
              )}
            </div>

            {/* Остальные факты — каждый в своей строке */}
            {(drama.airedFrom || drama.airedTo) && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Эфир:</span>
                <span>
                  {formatDate(drama.airedFrom)}
                  {drama.airedTo && ` — ${formatDate(drama.airedTo)}`}
                </span>
              </div>
            )}

            {platforms.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tv className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Канал:</span>
                <span>{platforms.join(", ")}</span>
              </div>
            )}

            {productionStudios.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Производство:</span>
                <span>{productionStudios.join(", ")}</span>
              </div>
            )}

            {drama.dubbingStudios && (
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Озвучка:</span>
                <span>{drama.dubbingStudios}</span>
              </div>
            )}
          </div>

          {drama.synopsis && (
            <p className="text-sm text-muted mt-5 leading-relaxed">
              {drama.synopsis}
            </p>
          )}

          {/* Внешние рейтинги + твой */}
          {(externalRatings.length > 0 || entry?.rating != null) && (
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-xs font-medium text-muted uppercase tracking-wider mb-3">
                Оценки
              </p>
              <div className="flex flex-wrap gap-3">
                {externalRatings.map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface"
                  >
                    <span className="text-xs text-muted">{r.name}</span>
                    <span className="text-sm font-semibold">
                      {r.value?.toFixed(1)}
                    </span>
                  </div>
                ))}
                {entry?.rating != null && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10">
                    <Star className="w-3.5 h-3.5 fill-current text-yellow-400" />
                    <span className="text-xs text-accent font-medium">
                      Твоя
                    </span>
                    <span className="text-sm font-semibold text-accent">
                      {entry.rating}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── ЗОНА 1: МОЙ ДНЕВНИК ─── */}
      {entry ? (
        <section className="mt-12 rounded-2xl border border-accent/20 bg-accent/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-accent">
              <NotebookPen className="w-5 h-5" />
              Мой дневник
            </h2>
            <EditEntryButton dramaId={drama.id} entry={entry} />
          </div>

          <div className="flex items-center gap-3 flex-wrap mb-6">
            <QuickStatusButtons
              dramaId={drama.id}
              currentStatus={entry.status}
              compact
            />
            {isCryTag(entry.cryTag) && (
              <CryBadge tag={entry.cryTag} size="md" />
            )}
            {entry.isFavorite && (
              <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 font-medium">
                <Crown className="w-4 h-4" />
                Особое место
              </span>
            )}
          </div>

          {entry.impression && (
            <div className="mb-6">
              <p className="text-sm font-medium text-muted mb-2">
                Впечатление
              </p>
              <p className="text-base text-foreground leading-relaxed">
                {entry.impression}
              </p>
            </div>
          )}

          {entry.review && (
            <div className="mb-6">
              <p className="text-sm font-medium text-muted mb-2">Отзыв</p>
              <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                {entry.review}
              </div>
            </div>
          )}

          {entry.quote && (
            <div className="mb-6">
              <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-yellow-400" />
                Особое место в сердце
              </p>
              <div className="rounded-xl border border-border bg-surface p-5 border-l-4 border-l-yellow-400/70">
                <Quote className="w-4 h-4 text-yellow-400/70 mb-2" />
                <p className="text-base italic leading-relaxed">
                  «{entry.quote}»
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted pt-4 border-t border-accent/20">
            {entry.startedAt && (
              <span className="flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-accent" />
                Начал: {formatDate(entry.startedAt)}
              </span>
            )}
            {entry.watchedAt && (
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-accent" />
                Досмотрел: {formatDate(entry.watchedAt)}
              </span>
            )}
            {entry.rewatchCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" />
                Пересмотров: {entry.rewatchCount}
              </span>
            )}
            {entry.status === "watching" &&
              entry.progress != null &&
              drama.episodes && (
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-accent" />
                  Прогресс: {entry.progress} / {drama.episodes}
                </span>
              )}
          </div>

          {drama.nominations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-accent/20">
              <p className="text-sm font-medium text-muted mb-3 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-accent" />
                Участие в номинациях
              </p>
              <div className="flex flex-wrap gap-2">
                {drama.nominations.map((n) => (
                  <span
                    key={n.id}
                    className="text-xs px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent"
                  >
                    {n.nomination.title}
                    {n.isWinner && " 🏆"}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 p-8 text-center">
          <Plus className="w-8 h-8 text-accent mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">
            Этой дорамы пока нет в твоём дневнике
          </h2>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            Добавь её одним кликом — детали можно заполнить позже.
          </p>
          <div className="flex justify-center">
            <QuickStatusButtons dramaId={drama.id} currentStatus={null} />
          </div>
        </section>
      )}

      {/* ─── ЗОНА 2: О ДОРАМЕ ─── */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-6 text-muted">
          <BookOpen className="w-5 h-5" />
          О дораме
        </h2>

        <div className="space-y-6">
          {/* Жанры */}
          <InfoBlock
            Icon={TagIcon}
            title="Жанры"
            isEmpty={genres.length === 0}
            emptyText="Жанры пока не заполнены"
          >
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
          </InfoBlock>

          {/* Съёмочная группа */}
          <InfoBlock
            Icon={Video}
            title="Съёмочная группа"
            isEmpty={directors.length === 0 && writers.length === 0}
            emptyText="Режиссёр и сценаристы пока не заполнены"
          >
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
          </InfoBlock>

          {/* Актёры и персонажи */}
          <InfoBlock
            Icon={Users}
            title="Актёры и персонажи"
            isEmpty={actors.length === 0}
            emptyText="Актёры пока не заполнены"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {actors.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-start gap-3 rounded-xl border border-border bg-surface p-3 border-l-4 ${importanceBorderColor(a.importance)}`}
                >
                  {/* Фото и имя актера - ссылка */}
                  <Link href={`/people/${a.person.id}`} className="shrink-0 flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-full bg-accent-soft/50 flex items-center justify-center text-xl overflow-hidden">
                      {a.person.photoUrl ? <img src={a.person.photoUrl} className="w-full h-full object-cover" /> : "👤"}
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link href={`/people/${a.person.id}`} className="text-sm font-semibold truncate hover:text-accent transition-colors">
                        {a.person.name}
                      </Link>
                      {a.importance === "lead" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                          Главная
                        </span>
                      )}
                    </div>

                    {/* Имя персонажа - ссылка на страницу персонажа */}
                    {a.character?.name && (
                      <Link href={`/characters/${a.character.id}`} className="text-xs text-accent mt-0.5 truncate hover:underline inline-block">
                        → {a.character.name}
                      </Link>
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
          </InfoBlock>

          {/* Саундтрек */}
          <InfoBlock
            Icon={Music}
            title="Саундтрек"
            isEmpty={drama.soundtrack.length === 0}
            emptyText="Саундтрек пока не заполнен"
          >
            <div className="flex flex-col gap-2">
              {drama.soundtrack.map((s) => (
                <SoundtrackPlayer key={s.id} track={s} />
              ))}
            </div>
          </InfoBlock>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({
  Icon,
  title,
  isEmpty,
  emptyText,
  children,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  isEmpty: boolean;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-accent" />
        {title}
      </h3>
      {isEmpty ? (
        <p className="text-xs text-muted/70 italic">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
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
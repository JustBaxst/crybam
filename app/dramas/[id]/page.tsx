import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, Calendar, MapPin, Film, Clock, PlayCircle, Eye,
  BookOpen, Users, Music, Video, ChevronRight, Crown, Languages, Tv,
  Info, Tag, Heart, Star as StarIcon
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { isCryTag } from "@/lib/cry-tags";
import { CryBadge } from "@/components/CryBadge";
import { AlternativeTitles } from "./AlternativeTitles";
import { StatusDropdown } from "./StatusDropdown";
import { SoundtrackPlayer } from "./SoundtrackPlayer";
import { EditEntryButton } from "./EditEntryButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RatingWidget } from "@/components/drama/RatingWidget";
import { TagsPopover } from "@/components/drama/TagsPopover";
import { CryTagSelector } from "@/components/drama/CryTagSelector";
import { CryTagStats } from "@/components/drama/CryTagStats";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ from?: string }>;

export default async function DramaPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id: rawId } = await params;
  const { from } = await searchParams;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const drama = await prisma.drama.findUnique({
    where: { id, deletedAt: null },
    include: {
      titles: { orderBy: { isPrimary: "desc" } },
      platforms: { include: { platform: true } },
      studios: { include: { studio: true } },
      genres: { include: { genre: true } },
      credits: {
        where: { person: { deletedAt: null } },
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
  const genres = drama.genres.map((g) => g.genre.name);

  const importanceOrder: Record<string, number> = { lead: 0, support: 1, guest: 2 };
  const actors = drama.credits
    .filter((c) => c.roleType === "actor")
    .sort((a, b) => {
      const ai = importanceOrder[a.importance] ?? 1;
      const bi = importanceOrder[b.importance] ?? 1;
      if (ai !== bi) return ai - bi;
      return (a.order ?? 999) - (b.order ?? 999);
    });
  const crew = drama.credits.filter((c) => c.roleType !== "actor");

  // ─── ЛОГИКА ОБРЕЗКИ (ПУНКТ 1) ───
  const truncateList = (arr: string[], limit = 2) => {
    if (arr.length <= limit) return arr.join(", ");
    return `${arr.slice(0, limit).join(", ")} + ${arr.length - limit}`;
  };

  const displayPlatforms = truncateList(drama.platforms.map(p => p.platform.name));
  const displayStudios = truncateList(drama.studios.map(s => s.studio.name));

  // Озвучка хранится строкой, разделенной запятыми
  const dubbingArr = drama.dubbingStudios
    ? drama.dubbingStudios.split(",").map(s => s.trim()).filter(Boolean)
    : [];
  const displayDubbing = truncateList(dubbingArr);

  // ─── ЛОГИКА ДАТ (ПУНКТ 3) ───
  const formatAired = (from: Date | null, to: Date | null) => {
    if (!from && !to) return null;
    const optFull: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const optShort: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

    // Хелпер для очистки от " г."
    const cleanDate = (d: Date, opts: Intl.DateTimeFormatOptions) => {
      return d.toLocaleDateString("ru-RU", opts).replace(" г.", "");
    };

    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (fromDate.getTime() === toDate.getTime()) {
        return cleanDate(fromDate, optFull);
      }
      if (fromDate.getFullYear() === toDate.getFullYear()) {
        return `${cleanDate(fromDate, optShort)} — ${cleanDate(toDate, optFull)}`;
      }
      return `${cleanDate(fromDate, optFull)} — ${cleanDate(toDate, optFull)}`;
    }
    return from
      ? cleanDate(new Date(from), optFull)
      : cleanDate(new Date(to!), optFull);
  };

  const airedText = formatAired(drama.airedFrom, drama.airedTo);

  const externalRatings = [
    { name: "Кинопоиск", value: drama.ratingKinopoisk },
    { name: "MyDramaList", value: drama.ratingMDL },
    { name: "IMDb", value: drama.ratingIMDB },
    { name: "Douban", value: drama.ratingDouban },
  ].filter((r) => r.value != null);

  // Данные для тегов
  const dramaThemes = await prisma.dramaThemeLink.findMany({
    where: { dramaId: id },
    include: { theme: true }
  });
  const themesList = dramaThemes.map(t => t.theme.name);
  const totalTags = genres.length + themesList.length;
  const hiddenTagsCount = Math.max(0, totalTags - 3);

  // Данные для CryTag
  const cryTagStatsRaw = await prisma.userDramaEntry.groupBy({
    by: ['cryTag'],
    where: { dramaId: id, cryTag: { not: null } },
    _count: { cryTag: true }
  });
  const cryTagStats = cryTagStatsRaw.map(s => ({ cryTag: s.cryTag as string, count: s._count.cryTag }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ─── ХЛЕБНЫЕ КРОШКИ ─── */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href={from === "library" ? "/library" : "/dramas"} className="hover:text-foreground transition-colors">
          {from === "library" ? "Библиотека" : "Каталог"}
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-foreground truncate">{mainTitle}</span>
      </div>

      {/* ─── ЗАГОЛОВОК И АЛЬТ. НАЗВАНИЯ (НА ВСЮ ШИРИНУ) ─── */}
      <div className="mb-8">
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] text-balance font-bold leading-tight mb-2">
          {mainTitle}
        </h1>
        <AlternativeTitles titles={altTitles} />
      </div>

      {/* ─── HERO-ЗОНА (ИДЕАЛЬНАЯ 3-КОЛОНОЧНАЯ СЕТКА) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

        {/* Колонка 1: Постер и Статус */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="aspect-2/3 rounded-2xl overflow-hidden border border-border bg-accent-soft flex items-center justify-center text-6xl shadow-lg">
            {drama.posterUrl ? (
              <img src={drama.posterUrl} alt={mainTitle} className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted">🎬</span>
            )}
          </div>
          <StatusDropdown dramaId={drama.id} entry={entry} episodes={drama.episodes} />
        </div>

        {/* Колонка 2: О дораме (занимает 2 части из 4) */}
        <div className="lg:col-span-2 bg-surface/20 p-6 rounded-2xl border border-border/50">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" /> О дораме
          </h2>

          {/* ─── УМНАЯ СЕТКА (ПУНКТ 4) ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

            {/* Левая колонка: Основные факты */}
            <div className="space-y-1.5 text-sm">
              {drama.country && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted/70 whitespace-nowrap">Страна:</span>
                    <span className="text-foreground font-medium">{drama.country}</span>
                  </div>
                </div>
              )}
              {drama.year && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted/70 whitespace-nowrap">Год:</span>
                    <span className="text-foreground font-medium">{drama.year}</span>
                  </div>
                </div>
              )}
              {drama.seasons && (
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted/70 whitespace-nowrap">Сезонов:</span>
                    <span className="text-foreground font-medium">{drama.seasons}</span>
                  </div>
                </div>
              )}
              {drama.episodes && (
                <div className="flex items-start gap-2">
                  <Film className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted/70 whitespace-nowrap">Серий:</span>
                    <span className="text-foreground font-medium">{drama.episodes}</span>
                  </div>
                </div>
              )}
              {drama.episodeDuration && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                    <span className="text-muted/70 whitespace-nowrap">Длительность:</span>
                    <span className="text-foreground font-medium">~{drama.episodeDuration} мин</span>
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка: Производство и эфир (Вертикальный стек) */}
            <div className="space-y-3 text-sm">
              {airedText && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Эфир:</span>
                    <span className="text-foreground font-medium leading-snug">{airedText}</span>
                  </div>
                </div>
              )}

              {displayPlatforms && (
                <div className="flex items-start gap-2">
                  <Tv className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Канал:</span>
                    <span className="text-foreground font-medium leading-snug">{displayPlatforms}</span>
                  </div>
                </div>
              )}

              {displayStudios && (
                <div className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Производство:</span>
                    <span className="text-foreground font-medium leading-snug">{displayStudios}</span>
                  </div>
                </div>
              )}

              {displayDubbing && (
                <div className="flex items-start gap-2">
                  <Languages className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Озвучка:</span>
                    <span className="text-foreground font-medium leading-snug">{displayDubbing}</span>
                  </div>
                </div>
              )}

              {/* Жанры */}
              <div className="flex items-start gap-2 pt-1">
                <Tag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1.5 w-full">
                  <span className="text-muted/70 text-[11px]">Жанры:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {genres.slice(0, 3).map((g) => (
                      <span key={g} className="bg-accent/10 text-accent border border-accent/20 rounded-full px-2 py-0.5 text-[10px] font-medium">
                        {g}
                      </span>
                    ))}
                    <TagsPopover
                      genres={drama.genres.map(g => g.genre)}
                      themes={themesList}
                      hiddenCount={hiddenTagsCount}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Колонка 3: Оценки и Эмоции (занимает 1 часть из 4) */}
        <div className="lg:col-span-1 bg-surface/20 p-4 rounded-2xl border border-border/50 flex flex-col gap-3 shrink-0">

          <div>
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Ваша оценка | Внешний рейтинг</h3>
            <RatingWidget dramaId={drama.id} initialRating={entry?.rating} />
          </div>

          <div className="border-t border-border/50 w-full" />

          <div className="grid grid-cols-2 gap-1.5">
            {externalRatings.map((r) => {
              const shortName = r.name === "Кинопоиск" ? "KP" : r.name === "MyDramaList" ? "MDL" : r.name;
              return (
                <div key={r.name} className="flex items-center justify-center gap-1 bg-surface border border-border rounded-md px-2 py-1.5 text-[11px]">
                  <span className="text-muted">{shortName}</span>
                  <span className="font-semibold tabular-nums text-foreground">{r.value?.toFixed(1)}</span>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Ваша эмоция | Настроение зрителей</h3>
            <CryTagSelector dramaId={drama.id} initialTag={entry?.cryTag} />

            <div className="border-t border-border/50 w-full my-3" />

            <CryTagStats stats={cryTagStats} />
          </div>

        </div>
      </div>

      {/* ─── СИНОПСИС ─── */}
      {drama.synopsis && (
        <div className="mb-10 bg-surface/20 p-6 rounded-2xl border border-border/50">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" /> О чем?
          </h2>
          <p className="text-muted leading-relaxed text-base max-w-5xl">{drama.synopsis}</p>
        </div>
      )}

      {/* ─── ТАБЫ ─── */}
      <Tabs defaultValue="diary" className="w-full">
        <TabsList>
          <TabsTrigger value="diary">Мой дневник</TabsTrigger>
          <TabsTrigger value="cast">В ролях и создатели</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
          <TabsTrigger value="soundtrack">Саундтрек</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
        </TabsList>

        {/* 1. ДНЕВНИК */}
        <TabsContent value="diary">
          {entry ? (
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-accent">Запись создана</h2>
                <EditEntryButton dramaId={drama.id} entry={entry} />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {isCryTag(entry.cryTag) && <CryBadge tag={entry.cryTag} size="md" />}
                {entry.isFavorite && (
                  <span className="inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400 font-medium">
                    <Crown className="w-4 h-4" /> Особое место
                  </span>
                )}
              </div>

              {entry.impression && (
                <div>
                  <p className="text-sm font-medium text-muted mb-2">Впечатление</p>
                  <p className="text-base text-foreground leading-relaxed">{entry.impression}</p>
                </div>
              )}

              {entry.review && (
                <div>
                  <p className="text-sm font-medium text-muted mb-2">Отзыв</p>
                  <div className="text-base text-foreground leading-relaxed whitespace-pre-wrap">{entry.review}</div>
                </div>
              )}

              {entry.quote && (
                <div>
                  <p className="text-sm font-medium text-muted mb-2 flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-yellow-400" /> Особое место в сердце
                  </p>
                  <div className="rounded-xl border border-border bg-surface p-5 border-l-4 border-l-yellow-400/70">
                    <p className="text-base italic leading-relaxed text-muted">«{entry.quote}»</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted pt-4 border-t border-accent/20">
                {entry.startedAt && (
                  <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4 text-accent" /> Начал: {new Date(entry.startedAt).toLocaleDateString("ru-RU")}</span>
                )}
                {entry.watchedAt && (
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-accent" /> Досмотрел: {new Date(entry.watchedAt).toLocaleDateString("ru-RU")}</span>
                )}
                {entry.rewatchCount > 0 && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-accent" /> Пересмотров: {entry.rewatchCount}</span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-border rounded-2xl">
              <p className="text-muted mb-4">Вы еще не добавили эту дораму в свой дневник.</p>
            </div>
          )}
        </TabsContent>

        {/* 2. В РОЛЯХ И СОЗДАТЕЛИ */}
        <TabsContent value="cast">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actors.map((a) => (
              <div key={a.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <Link href={`/people/${a.person.id}`} className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-accent-soft/50 flex items-center justify-center overflow-hidden">
                    {a.person.photoUrl ? <img src={a.person.photoUrl} className="w-full h-full object-cover" /> : "👤"}
                  </div>
                </Link>
                <div>
                  <Link href={`/people/${a.person.id}`} className="font-semibold text-foreground hover:text-accent">{a.person.name}</Link>
                  {a.character?.name && (
                    <Link href={`/characters/${a.character.id}`} className="block text-sm text-accent mt-0.5 hover:underline">
                      {a.character.name}
                    </Link>
                  )}
                  {a.character?.description && <p className="text-xs text-muted mt-1 line-clamp-2">{a.character.description}</p>}
                </div>
              </div>
            ))}

            {crew.map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
                <div className="w-12 h-12 rounded-full bg-accent-soft/50 flex items-center justify-center overflow-hidden">
                  {c.person.photoUrl ? <img src={c.person.photoUrl} className="w-full h-full object-cover" /> : "🎬"}
                </div>
                <div>
                  <Link href={`/people/${c.person.id}`} className="font-semibold text-foreground hover:text-accent">{c.person.name}</Link>
                  <p className="text-sm text-muted mt-0.5">{c.roleType === "director" ? "Режиссер" : "Сценарист"}</p>
                  {c.note && <p className="text-xs text-muted mt-1">{c.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 3. ГАЛЕРЕЯ */}
        <TabsContent value="gallery">
          <div className="text-center py-10 text-muted italic">
            Галерея пока пуста. (Скоро здесь появятся трейлеры и кадры)
          </div>
        </TabsContent>

        {/* 4. САУНДТРЕК */}
        <TabsContent value="soundtrack">
          {drama.soundtrack.length > 0 ? (
            <div className="flex flex-col gap-2">
              {drama.soundtrack.map((s) => <SoundtrackPlayer key={s.id} track={s} />)}
            </div>
          ) : (
            <p className="text-muted italic">Саундтрек пока не добавлен.</p>
          )}
        </TabsContent>

        {/* 5. ОТЗЫВЫ */}
        <TabsContent value="reviews">
          <div className="text-center py-10 text-muted italic">
            Раздел отзывов в разработке.
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
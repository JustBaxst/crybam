import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star, Calendar, MapPin, Film, Clock, PlayCircle, Eye,
  BookOpen, Users, Music, Video, Award, ChevronRight
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
import { Button } from "@/components/ui/button";

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

  // Формируем строку метаданных (Год · Страна · 1 сезон · 16 серий · ~70 мин)
  const metaString = [
    drama.year,
    drama.country,
    drama.seasons ? `${drama.seasons} сезон` : null,
    drama.episodes ? `${drama.episodes} серий` : null,
    drama.episodeDuration ? `~${drama.episodeDuration} мин` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ─── ХЛЕБНЫЕ КРОШКИ ─── */}
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <Link href={from === "library" ? "/library" : "/dramas"} className="hover:text-foreground transition-colors">
          {from === "library" ? "Библиотека" : "Каталог"}
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-foreground truncate">{mainTitle}</span>
      </div>

      {/* ─── HERO-ЗОНА (ИДЕНТИЧНОСТЬ) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Левая колонка: Постер */}
        <div className="md:col-span-1">
          <div className="aspect-[2/3] rounded-2xl overflow-hidden border border-border bg-accent-soft flex items-center justify-center text-6xl shadow-lg relative">
            {drama.posterUrl ? (
              <img src={drama.posterUrl} alt={mainTitle} className="w-full h-full object-cover" />
            ) : (
              <span className="text-muted">🎬</span>
            )}
            {/* Кнопка статуса поверх постера (если нужна) */}
            <div className="absolute bottom-4 left-4 right-4">
              <StatusDropdown dramaId={drama.id} entry={entry} episodes={drama.episodes} />
            </div>
          </div>
        </div>

        {/* Правая колонка: Информация */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2">{mainTitle}</h1>
          <AlternativeTitles titles={altTitles} />

          {/* Сжатые метаданные */}
          <p className="text-muted text-base mt-4">{metaString || "Метаданные не заполнены"}</p>

          {/* Теги (Жанры) */}
          <div className="flex flex-wrap gap-2 mt-6">
            {genres.slice(0, 3).map((g) => (
              <span key={g} className="px-3 py-1 rounded-full bg-accent-soft text-accent text-sm font-medium">
                {g}
              </span>
            ))}
            {genres.length > 3 && (
              <button className="px-3 py-1 rounded-full border border-border text-muted text-sm hover:border-accent transition-colors">
                +{genres.length - 3} тегов
              </button>
            )}
            {isCryTag(drama.curatorCryTag) && (
              <CryBadge tag={drama.curatorCryTag} size="md" />
            )}
          </div>

          {/* ОЦЕНКИ (Визуальная заглушка для 10 сегментов) */}
          <div className="mt-8">
            <p className="text-sm font-medium text-muted mb-2">Ваша оценка</p>
            <div className="flex gap-1 cursor-pointer">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 flex-1 rounded-sm bg-border/50 hover:bg-accent/50 transition-colors"
                  title={`Оценить на ${i + 1}`}
                />
              ))}
            </div>
            {entry?.rating && (
              <p className="text-xs text-accent mt-2">Сохранено: {entry.rating}</p>
            )}
          </div>
        </div>
      </div>

      {/* ─── СИНОПСИС ─── */}
      {drama.synopsis && (
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-3">О чем?</h2>
          <p className="text-muted leading-relaxed max-w-prose">
            {drama.synopsis}
          </p>
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
            <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-accent">
                  Запись создана
                </h2>
                <EditEntryButton dramaId={drama.id} entry={entry} />
              </div>
              {entry.impression && <p className="text-foreground mb-4">{entry.impression}</p>}
              {entry.review && <div className="text-muted whitespace-pre-wrap">{entry.review}</div>}
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
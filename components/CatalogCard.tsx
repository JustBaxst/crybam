"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Eye, ArrowLeft } from "lucide-react";
import { PosterImage } from "@/components/PosterImage";
import { CardStatusToolbar } from "@/components/drama/CardStatusToolbar";
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CatalogCardProps = {
  dramaId: number;
  title: string;
  year: number | null;
  country: string | null;
  posterUrl: string | null;
  ratingKinopoisk: number | null;
  ratingIMDB: number | null;
  genres: { id: number; name: string }[];
  themes: string[];
  moods: string[];
  episodes: number | null;
  synopsis: string | null;
  dominantCryTag?: CryTag | null;
  entry?: {
    status: string;
    progress: number | null;
    rewatchCount: number;
  } | null;
};

export function CatalogCard({
  dramaId, title, year, country, posterUrl, ratingKinopoisk, ratingIMDB,
  genres, themes, moods, episodes, synopsis, dominantCryTag, entry
}: CatalogCardProps) {
  const [showTags, setShowTags] = useState(false);

  const rating = ratingKinopoisk ?? ratingIMDB ?? null;
  const metaString = [year, country, episodes ? `${episodes} сер.` : null].filter(Boolean).join(" · ");
  const cryTagConfig = dominantCryTag ? CRY_TAGS[dominantCryTag] : null;

  const totalTags = genres.length + themes.length + moods.length;
  const hiddenTagsCount = Math.max(0, totalTags - 3);

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-border bg-surface transition-colors hover:border-accent/50"
      onMouseLeave={() => setShowTags(false)}
    >
      {/* ─── ПОСТЕР И HOVER-ОВЕРЛЕЙ ─── */}
      <div className="relative aspect-2/3 bg-accent-soft overflow-hidden rounded-t-xl">

        <Link href={`/dramas/${dramaId}`} className="absolute inset-0 z-10">
          <PosterImage posterUrl={posterUrl} title={title} year={year} className="absolute inset-0" />
        </Link>

        {/* Верхние пилюли (исчезают при наведении) */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
          <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-semibold shadow-sm">
            <Star className={`w-3.5 h-3.5 shrink-0 ${rating ? "fill-current text-yellow-400" : "text-white/50"}`} />
            <span className="text-white translate-y-0">
              {rating != null ? rating.toFixed(1) : "—"}
            </span>
          </div>

          {cryTagConfig ? (
            <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-semibold shadow-sm">
              <cryTagConfig.Icon className={`w-3.5 h-3.5 shrink-0 ${cryTagConfig.color}`} />
              <span className="text-white -translate-y-px">{cryTagConfig.label}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-semibold shadow-sm">
              <Eye className="w-3.5 h-3.5 shrink-0 text-white/50" />
              <span className="text-white -translate-y-px">Сбор данных</span>
            </div>
          )}
        </div>

        {/* Hover-оверлей */}
        <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 hidden md:flex flex-col justify-between p-4">

          <div className="w-full flex-1 overflow-hidden pt-4 relative">
            {!showTags ? (
              <p className="text-white/90 text-xs leading-relaxed line-clamp-14">
                {synopsis || "Описание пока отсутствует..."}
              </p>
            ) : (
              <div className="flex flex-col h-full">
                <button
                  onClick={() => setShowTags(false)}
                  className="text-[10px] text-accent hover:underline flex items-center gap-1 w-fit mb-2 cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3 h-3" /> Назад к описанию
                </button>

                {/* Контейнер с line-clamp-14 */}
                <div className="text-white/90 text-xs leading-relaxed line-clamp-12">

                  {genres.length > 0 && (
                    <div className="mb-1.5">
                      <span className="text-[10px] text-white/50 uppercase mb-1 block">Жанры</span>
                      {/* Текст в строку через запятую */}
                      <span>
                        {genres.map((g, i) => (
                          <span key={g.id}>
                            <Link href={`/dramas?genre=${g.id}`} className="hover:text-accent hover:underline cursor-pointer">
                              {g.name}
                            </Link>
                            {i < genres.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  {moods.length > 0 && (
                    <div className="mb-1.5">
                      <span className="text-[10px] text-white/50 uppercase mb-1 block">Настроение</span>
                      {/* Текст в строку через запятую */}
                      <span>
                        {moods.map((m, i) => (
                          <span key={m}>
                            <Link href={`/dramas?mood=${encodeURIComponent(m)}`} className="hover:text-accent hover:underline cursor-pointer">
                              {m}
                            </Link>
                            {i < moods.length - 1 && ", "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                  {themes.length > 0 && (
                    <div className="mb-1.5">
                      <span className="text-[10px] text-white/50 uppercase mb-1 block">Темы</span>
                      {/* Текст в строку через пробел */}
                      <span>
                        {themes.map((t, i) => (
                          <span key={t}>
                            <Link href={`/dramas?theme=${encodeURIComponent(t)}`} className="hover:text-accent hover:underline cursor-pointer">
                              #{t}
                            </Link>
                            {i < themes.length - 1 && " "}
                          </span>
                        ))}
                      </span>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>

          <div className="w-full shrink-0">
            <CardStatusToolbar dramaId={dramaId} currentStatus={entry?.status} />
          </div>
        </div>
      </div>

      {/* ─── ИНФОРМАЦИЯ ─── */}
      <div className="p-3 flex flex-col flex-1 rounded-b-xl">
        <Link href={`/dramas/${dramaId}`} className="hover:text-accent transition-colors">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 min-h-[2.4em]">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-muted mt-1">{metaString}</p>

        {/* Жанры и Матрешка */}
        <div className="mt-auto pt-2 flex flex-wrap gap-1 items-center">
          {genres.slice(0, 3).map((g) => (
            <span key={g.id} className="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
              {g.name}
            </span>
          ))}

          {hiddenTagsCount > 0 && (
            <button
              onClick={() => setShowTags(true)}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted hover:bg-surface transition-colors cursor-pointer"
            >
              +{hiddenTagsCount}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
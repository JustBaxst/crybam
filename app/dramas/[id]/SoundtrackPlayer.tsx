"use client";

import { useState } from "react";
import { X, Music, ExternalLink, Trophy, PlayCircle } from "lucide-react";
import { SiYoutube, SiSpotify, SiSoundcloud, SiVk } from "react-icons/si";

// Компонент для иконки сервиса (вынесем отдельно, чтобы использовать и в кнопке, и в модалке)
export function ProviderIcon({ provider }: { provider: string | null }) {
  switch (provider) {
    case "youtube": return <SiYoutube className="w-4 h-4" />;
    case "spotify": return <SiSpotify className="w-4 h-4" />;
    case "soundcloud": return <SiSoundcloud className="w-4 h-4" />;
    case "vk": return <SiVk className="w-4 h-4" />;
    case "yandex":
      return (
        <span className="w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-current/10 rounded-sm">
          Я
        </span>
      );
    default: return <PlayCircle className="w-4 h-4" />;
  }
}

export function SoundtrackPlayer({ track }: { track: any }) {
  const [isOpen, setIsOpen] = useState(false);

  // Генерируем URL для iframe в зависимости от сервиса
  const getEmbedUrl = () => {
    if (!track.embedId) return null;
    switch (track.provider) {
      case "youtube":
        return `https://www.youtube.com/embed/${track.embedId}?autoplay=1`;
      case "spotify":
        return `https://open.spotify.com/embed/track/${track.embedId}?utm_source=generator&theme=0`;
      case "yandex":
        // Яндекс использует свой формат, для простоты оставим ссылку (или общий iframe)
        return `https://music.yandex.ru/iframe/#track/${track.embedId}/`;
      case "soundcloud":
        return `https://w.soundcloud.com/player/?url=${track.embedId}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
      default:
        return null;
    }
  };

  const embedUrl = getEmbedUrl();

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors">
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Music className="w-5 h-5 text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{track.title}</p>
            {track.kind && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted shrink-0">
                {kindLabel(track.kind)}
              </span>
            )}
          </div>
          {track.artist && <p className="text-xs text-muted truncate">{track.artist}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
          >
            <ProviderIcon provider={track.provider} />
            <span className="hidden sm:inline">Слушать</span>
          </button>
          <button className="w-8 h-8 rounded-lg border border-border hover:border-yellow-400/50 hover:text-yellow-400 flex items-center justify-center transition-colors" title="Номинировать">
            <Trophy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Модалка с плеером */}
      {isOpen && (
        <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{track.title}</p>
                <p className="text-xs text-muted truncate">{track.artist}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={track.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-accent flex items-center gap-1">
                  Открыть в сервисе <ExternalLink className="w-3 h-3" />
                </a>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-black/50">
              {embedUrl ? (
                track.provider === "spotify" ? (
                  <div className="relative w-full h-88 overflow-hidden rounded-xl">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${track.embedId}?utm_source=generator&theme=1`}
                      width="100%"
                      height="352"
                      className="block border-0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      style={{ borderRadius: "12px" }}
                    />
                  </div>
                ) : (
                  // Универсальный рендер для YouTube, SoundCloud и Яндекс.Музыки
                  <iframe
                    src={embedUrl}
                    className="w-full aspect-video rounded-lg"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm text-muted mb-4">Для этого сервиса нет встроенного плеера.</p>
                  <a href={track.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">
                    Перейти на сайт <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
function kindLabel(kind: string) {
  const map: Record<string, string> = {
    ost_part: "OST Part",
    full_ost: "OST",
    bgm: "BGM",
    instrumental: "Inst.",
  };
  return map[kind] || kind;
}
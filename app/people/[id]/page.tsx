import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight, Calendar, Briefcase, Film, User as UserIcon, MapPin,
  Ruler, Link as LinkIcon, Droplet, Brain, Sparkles, Flag, Info, BookOpen, Image as ImageIcon
} from "lucide-react";
import {
  FaInstagram, FaYoutube, FaTwitter, FaTiktok, FaWikipediaW,
  FaGlobe, FaFacebook, FaLinkedin, FaTelegram, FaDiscord,
  FaRedditAlien, FaPinterest, FaSnapchat, FaTwitch, FaVk,
  FaSpotify, FaSoundcloud, FaImdb, FaGithub, FaMedium, FaWeibo, FaYandex
} from "react-icons/fa6";
import {
  SiThreads, SiBluesky, SiLine, SiWechat,
  SiBilibili, SiNaver, SiKakaotalk, SiApplemusic,
  SiTumblr, SiVimeo, SiDailymotion, SiPatreon,
  SiMastodon, SiSubstack, SiFlickr
} from "react-icons/si";
import { prisma } from "@/lib/prisma";
import { AlternativeTitles } from "@/app/dramas/[id]/AlternativeTitles";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FavoriteActorButton } from "@/components/people/FavoriteActorButton";

// Словарь для быстрого сопоставления платформы и иконки
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram, youtube: FaYoutube, twitter: FaTwitter, x: FaTwitter,
  tiktok: FaTiktok, weibo: FaWeibo, wikipedia: FaWikipediaW, website: FaGlobe,
  facebook: FaFacebook, linkedin: FaLinkedin, telegram: FaTelegram, discord: FaDiscord,
  reddit: FaRedditAlien, pinterest: FaPinterest, snapchat: FaSnapchat, twitch: FaTwitch,
  vk: FaVk, spotify: FaSpotify, soundcloud: FaSoundcloud, imdb: FaImdb,
  github: FaGithub, medium: FaMedium, threads: SiThreads, bluesky: SiBluesky,
  line: SiLine, wechat: SiWechat, bilibili: SiBilibili, naver: SiNaver,
  kakao: SiKakaotalk, applemusic: SiApplemusic, yandexmusic: FaYandex, douyin: FaTiktok,
  tumblr: SiTumblr, vimeo: SiVimeo, dailymotion: SiDailymotion, patreon: SiPatreon,
  mastodon: SiMastodon, substack: SiSubstack, flickr: SiFlickr,
};

type Params = Promise<{ id: string }>;

export default async function PersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({
    where: { id, deletedAt: null },
    include: {
      aliases: true,
      socialLinks: true,
      credits: {
        where: { drama: { deletedAt: null } }, // скрываем кредиты удалённых дорам
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
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* ─── ХЛЕБНЫЕ КРОШКИ ─── */}
      <div className="flex items-center gap-2 text-sm text-muted mb-6">
        <Link href="/people" className="hover:text-foreground transition-colors">
          Все актёры
        </Link>
        <ChevronRight className="w-4 h-4 opacity-50" />
        <span className="text-foreground truncate">{person.name}</span>
      </div>

      {/* ─── ЗАГОЛОВОК И АЛЬТ. ИМЕНА (НА ВСЮ ШИРИНУ) ─── */}
      <div className="mb-8">
        <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] text-balance font-bold leading-tight mb-2">
          {person.name}
        </h1>
        <AlternativeTitles
          label="Другие имена:"
          titles={[
            ...(person.nameNative ? [{ id: -1, title: person.nameNative, language: "ko" }] : []),
            ...person.aliases.map((a) => ({
              id: a.id,
              title: a.name,
              language: a.language
            }))
          ].filter((v, i, a) => a.findIndex(t => t.title === v.title) === i)}
        />
      </div>

      {/* ─── HERO-ЗОНА (СЕТКА ИЗ 3 КОЛОНОК) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">

        {/* Колонка 1: Фото */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="aspect-2/3 rounded-2xl overflow-hidden border border-border bg-accent-soft flex items-center justify-center text-6xl shadow-lg">
            {person.photoUrl ? (
              <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-16 h-16 text-muted" />
            )}
          </div>

          {/* НОВАЯ КНОПКА-ЗАГЛУШКА */}
          <FavoriteActorButton />

        </div>

        {/* Колонка 2: О персоне (занимает 2 части из 4) */}
        <div className="lg:col-span-2 bg-surface/20 p-6 rounded-2xl border border-border/50">
          <h2 className="text-lg font-semibold mb-4 pb-4 border-b border-border/50 flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" /> О персоне
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">

            {/* Левая колонка фактов */}
            <div className="space-y-3">
              {person.gender && (
                <div className="flex items-start gap-2">
                  <UserIcon className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Пол:</span>
                    <span className="text-foreground font-medium">{person.gender === 'male' ? 'Мужской' : person.gender === 'female' ? 'Женский' : 'Другой'}</span>
                  </div>
                </div>
              )}
              {person.birthDate && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Дата рождения:</span>
                    <span className="text-foreground font-medium">
                      {new Date(person.birthDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}
                      {age !== null && <span className="text-muted/70 font-normal"> ({age} лет)</span>}
                    </span>
                  </div>
                </div>
              )}
              {person.birthPlace && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Место рождения:</span>
                    <span className="text-foreground font-medium">{person.birthPlace}</span>
                  </div>
                </div>
              )}
              {person.nationality && (
                <div className="flex items-start gap-2">
                  <Flag className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Национальность:</span>
                    <span className="text-foreground font-medium">{person.nationality}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Правая колонка фактов */}
            <div className="space-y-3">
              {person.height && (
                <div className="flex items-start gap-2">
                  <Ruler className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Рост:</span>
                    <span className="text-foreground font-medium">{person.height} см</span>
                  </div>
                </div>
              )}
              {person.agency && (
                <div className="flex items-start gap-2">
                  <Briefcase className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Агентство:</span>
                    <span className="text-foreground font-medium">{person.agency}</span>
                  </div>
                </div>
              )}
              {person.bloodType && (
                <div className="flex items-start gap-2">
                  <Droplet className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Группа крови:</span>
                    <span className="text-foreground font-medium">{person.bloodType}</span>
                  </div>
                </div>
              )}
              {person.mbti && (
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">MBTI:</span>
                    <span className="text-foreground font-medium">{person.mbti}</span>
                  </div>
                </div>
              )}
              {(person.zodiacWestern || person.zodiacChinese) && (
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted/70 text-[11px]">Зодиак:</span>
                    <span className="text-foreground font-medium">
                      {person.zodiacWestern} {person.zodiacChinese && ` / ${person.zodiacChinese}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Соцсети */}
          {person.socialLinks.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-[11px] text-muted/70 mb-2 block">Социальные сети:</span>
              <div className="flex flex-wrap gap-2">
                {person.socialLinks.map((link) => {
                  const p = link.platform.toLowerCase();
                  const Icon = SOCIAL_ICONS[p] || LinkIcon;
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-surface text-muted hover:text-accent hover:border-accent/40 transition-all text-xs"
                      title={link.platform}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="capitalize">{link.platform}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Колонка 3: Пустой блок (на будущее) */}
        <div className="lg:col-span-1 bg-surface/20 p-5 rounded-2xl border border-border/50 flex flex-col gap-4 shrink-0">
          <h3 className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-2">Действия</h3>
          <div className="text-sm text-muted italic">Скоро здесь появятся функции...</div>
        </div>
      </div>

      {/* ─── БИОГРАФИЯ ─── */}
      {person.bio && (
        <div className="w-full mb-10 bg-surface/20 p-6 rounded-2xl border border-border/50">
          <h2 className="text-lg font-semibold mb-4 pb-3 border-b border-border/50 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" /> Биография
          </h2>
          <p className="w-full text-muted leading-relaxed text-base whitespace-pre-wrap">
            {person.bio}
          </p>
        </div>
      )}

      {/* ─── ТАБЫ ─── */}
      <Tabs defaultValue="filmography" className="w-full">
        <TabsList>
          <TabsTrigger value="filmography">Фильмография</TabsTrigger>
          <TabsTrigger value="gallery">Галерея</TabsTrigger>
        </TabsList>

        {/* 1. ФИЛЬМОГРАФИЯ */}
        <TabsContent value="filmography">
          {filmography.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-2xl">
              <p className="text-muted italic">Актёр пока не привязан ни к одной дораме.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filmography.map((c) => (
                <Link
                  key={c.id}
                  href={`/dramas/${c.drama.id}`}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-surface p-4 hover:border-accent/50 transition-colors"
                >
                  <div className="w-16 h-24 rounded-lg overflow-hidden bg-accent-soft/40 flex items-center justify-center text-2xl shrink-0">
                    {c.drama.posterUrl ? (
                      <img src={c.drama.posterUrl} alt={c.drama.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <span className="text-muted">🎬</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate group-hover:text-accent transition-colors">
                      {c.drama.title}
                    </p>
                    {c.drama.year && <p className="text-xs text-muted mt-0.5">{c.drama.year}</p>}

                    {c.character?.name && (
                      <p className="text-xs text-accent mt-1.5 truncate font-medium">
                        → {c.character.name}
                      </p>
                    )}
                    {c.character?.description && (
                      <p className="text-xs text-muted mt-1 line-clamp-2 leading-relaxed">
                        {c.character.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {c.importance === "lead" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-yellow-400/40 bg-yellow-400/10 text-yellow-400">
                          Главная
                        </span>
                      )}
                      {c.importance === "guest" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">
                          Эпизод
                        </span>
                      )}
                      {c.roleType !== "actor" && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-border text-muted">
                          {roleLabel(c.roleType)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 2. ГАЛЕРЕЯ (Заглушка) */}
        <TabsContent value="gallery">
          <div className="text-center py-10 text-muted italic border border-dashed border-border rounded-2xl flex flex-col items-center justify-center">
            <ImageIcon className="w-10 h-10 text-muted/50 mb-3" />
            Галерея фотографий пока пуста.
          </div>
        </TabsContent>
      </Tabs>
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
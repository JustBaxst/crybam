import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Calendar, Briefcase, Film, User as UserIcon, MapPin,
  Ruler, Link as LinkIcon, Droplet, Brain, Sparkles, Flag 
} from "lucide-react";
import { FaInstagram, FaYoutube, FaTwitter, FaTiktok, FaWikipediaW, 
  FaGlobe, FaFacebook, FaLinkedin, FaTelegram, FaDiscord, 
  FaRedditAlien, FaPinterest, FaSnapchat, FaTwitch, FaVk, 
  FaSpotify, FaSoundcloud, FaImdb, FaGithub, FaMedium, FaWeibo, FaYandex } from "react-icons/fa6";
import { 
  SiThreads, SiBluesky, SiLine, SiWechat, 
  SiBilibili, SiNaver, SiKakaotalk, SiApplemusic,
  SiTumblr, SiVimeo, SiDailymotion, SiPatreon,
  SiMastodon, SiSubstack, SiFlickr 
} from "react-icons/si";
import { prisma } from "@/lib/prisma";
import { AlternativeTitles } from "@/app/dramas/[id]/AlternativeTitles";

// Словарь для быстрого сопоставления платформы и иконки
const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  twitter: FaTwitter,
  x: FaTwitter,
  tiktok: FaTiktok,
  weibo: FaWeibo,
  wikipedia: FaWikipediaW,
  website: FaGlobe,
  facebook: FaFacebook,
  linkedin: FaLinkedin,
  telegram: FaTelegram,
  discord: FaDiscord,
  reddit: FaRedditAlien,
  pinterest: FaPinterest,
  snapchat: FaSnapchat,
  twitch: FaTwitch,
  vk: FaVk,
  spotify: FaSpotify,
  soundcloud: FaSoundcloud,
  imdb: FaImdb,
  github: FaGithub,
  medium: FaMedium,
  threads: SiThreads,
  bluesky: SiBluesky,
  line: SiLine,
  wechat: SiWechat,
  bilibili: SiBilibili,
  naver: SiNaver,
  kakao: SiKakaotalk,
  applemusic: SiApplemusic,
  yandexmusic: FaYandex,
  douyin: FaTiktok,
  tumblr: SiTumblr,
  vimeo: SiVimeo,
  dailymotion: SiDailymotion,
  patreon: SiPatreon,
  mastodon: SiMastodon,
  substack: SiSubstack,
  flickr: SiFlickr,
};

type Params = Promise<{ id: string }>;

export default async function PersonPage({ params }: { params: Params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);

  if (!Number.isInteger(id) || id <= 0) notFound();

  const person = await prisma.person.findUnique({
    where: { id },
    include: {
      aliases: true,
      socialLinks: true, // ← Подтягиваем соцсети
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
        {/* ФОТО ТЕПЕРЬ ПРЯМОУГОЛЬНОЕ (2:3) */}
        <div className="w-32 h-48 md:w-40 md:h-60 rounded-2xl bg-accent-soft flex items-center justify-center text-6xl shrink-0 overflow-hidden shadow-lg">
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

          {/* Блок пилюль */}
          <AlternativeTitles 
            label="Другие имена:"
            titles={[
              ...(person.nameNative ? [{ id: -1, title: person.nameNative, language: "ko" }] : []),
              ...person.aliases.map((a) => ({ 
                id: a.id, 
                title: a.name, 
                language: a.language 
              }))
            ].filter((v, i, a) => 
              a.findIndex(t => t.title === v.title) === i
            )} 
          />

     {/* Новые поля: Пол, Рост, Место рождения и др. */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-muted">
            {person.gender && (
              <span className="flex items-center gap-1.5">
                <UserIcon className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Пол:</span>
                {person.gender === 'male' ? 'Мужской' : person.gender === 'female' ? 'Женский' : 'Другой'}
              </span>
            )}
            {person.height && (
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Рост:</span>
                {person.height} см
              </span>
            )}
            {person.birthPlace && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Место рождения:</span>
                {person.birthPlace}
              </span>
            )}
            {person.birthDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Дата рождения:</span>
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

            {person.nationality && (
              <span className="flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Национальность:</span>
                {person.nationality}
              </span>
            )}
            
            {person.agency && (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Агентство:</span>
                {person.agency}
              </span>
            )}
                   {person.bloodType && (
              <span className="flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Группа крови:</span>
                {person.bloodType}
              </span>
            )}
            {person.mbti && (
              <span className="flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-accent" />
                <span className="text-muted/70">MBTI:</span>
                {person.mbti}
              </span>
            )}
            {person.zodiacWestern && (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Зодиак:</span>
                {person.zodiacWestern}
              </span>
            )}
            {person.zodiacChinese && (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-muted/70">Кит. зодиак:</span>
                {person.zodiacChinese}
              </span>
            )}
          </div>

          {/* Соцсети и ссылки */}
          {person.socialLinks.length > 0 && (
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <span className="text-xs text-muted">Ссылки:</span>
              {person.socialLinks.map((link) => {
                const p = link.platform.toLowerCase();
                // Берем иконку из словаря, если нет — показываем цепочку
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
          )}

          {person.bio && (
            <p className="text-sm text-muted mt-5 leading-relaxed whitespace-pre-wrap">
              {person.bio}
            </p>
          )}
        </div>
      </div>

      {/* Фильмография (без изменений) */}
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
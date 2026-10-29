import Link from "next/link";
import { CryBadge } from "@/components/CryBadge";
import {
  Flame,
  Crown,
  MessageCircle,
  User,
  Check,
  X,
  Circle,
  Heart,
  Ban,
  StickyNote,
  Star,
  MapPin,
  Cake,
} from "lucide-react";
import { YearHeatmap } from "@/components/YearHeatmap";
import { LibraryBar } from "@/components/LibraryBar";
import { prisma } from "@/lib/prisma";
import { CURRENT_USER_ID } from "@/lib/current-user";
import { HorizontalScroll } from "@/components/HorizontalScroll";

export default async function HomePage() {
  // 1. Пользователь
  const user = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
  });

  // 2. Все записи с дорамами (свежие сверху)
  const entries = await prisma.userDramaEntry.findMany({
    where: {
      userId: CURRENT_USER_ID,
      drama: { deletedAt: null }
    },
    include: { drama: true },
    orderBy: { updatedAt: "desc" },
  });

  // --- СТАТИСТИКА ---
  const watchedCount = entries.filter((e) => e.status === "watched").length;
  const plannedCount = entries.filter((e) => e.status === "planned").length;
  const watchingCount = entries.filter((e) => e.status === "watching").length;
  const onHoldCount = entries.filter((e) => e.status === "on_hold").length;
  const droppedCount = entries.filter((e) => e.status === "dropped").length;

  // Часы (только просмотренные)
  const totalHours = Math.round(
    entries
      .filter((e) => e.status === "watched")
      .reduce((sum, e) => sum + (e.drama.episodes || 0) * (e.drama.episodeDuration || 60), 0) / 60
  );

  const favoritesCount = entries.filter((e) => e.isFavorite).length;

  // 3. Недавние отзывы
  const recentReviews = entries
    .filter((e) => e.review || e.impression)
    .slice(0, 3);

  // 4. Особое место
  const heartDramas = entries
    .filter((e) => e.isFavorite && e.quote)
    .slice(0, 10)

  // 5. Heatmap
  const heatmapGrouped = new Map<string, { totalEpisodes: number; dramas: { title: string; episodes: number }[] }>();

  entries
    .filter((e) => e.watchedAt)
    .forEach((e) => {
      // Используем локальную дату в формате YYYY-MM-DD
      const dateKey = e.watchedAt!.toLocaleDateString("sv-SE");
      const episodes = e.drama.episodes || 1;

      const existing = heatmapGrouped.get(dateKey);
      if (existing) {
        existing.totalEpisodes += episodes;
        existing.dramas.push({ title: e.drama.title, episodes });
      } else {
        heatmapGrouped.set(dateKey, {
          totalEpisodes: episodes,
          dramas: [{ title: e.drama.title, episodes }],
        });
      }
    });

  const heatmapActivities = Array.from(heatmapGrouped.entries()).map(([date, data]) => ({
    date,
    level: Math.min(Math.ceil(data.totalEpisodes / 4), 4), // Уровень зависит от суммы серий
    episodes: data.totalEpisodes,
    items: data.dramas, // Массив дорам
  }));

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
    : "недавно";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* ─── Приветствие ─── */}
      <section className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent-soft flex items-center justify-center text-3xl shrink-0">
          🎬
        </div>
        <div>
          <h1 className="text-2xl font-bold">Привет, {user?.name || "Артём"}</h1>
          <p className="text-muted text-sm mt-1">
            в дневнике с {joinDate}
          </p>
          <div className="text-muted text-xs mt-1.5 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Страна
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-accent" /> Пол
            </span>
            <span className="flex items-center gap-1">
              <Cake className="w-3.5 h-3.5 text-accent" /> Возраст
            </span>
          </div>
        </div>
      </section>

      {/* ─── Статистика ─── */}
      <LibraryBar
        counts={{
          watched: watchedCount,
          watching: watchingCount,
          planned: plannedCount,
          on_hold: onHoldCount,
          dropped: droppedCount,
        }}
      />

      {/* ─── Активность ─── */}
      <section>
        <SectionHeader
          Icon={Flame}
          title="Активность"
          href="/stats"
          count={null}
        />
        <YearHeatmap activities={heatmapActivities} />
      </section>

      {/* ─── Особое место ─── */}
      {heartDramas.length > 0 && (
        <section>
          <SectionHeader
            Icon={Crown}
            title="Особое место в сердце"
            href="/heart"
            count={favoritesCount}
          />
          <HorizontalScroll>
            {heartDramas.map((entry) => (
              <div key={entry.id} className="min-w-70 max-w-80 snap-start shrink-0">
                <HeartPreview
                  title={entry.drama.title}
                  year={entry.drama.year || 0}
                  quote={entry.quote || ""}
                />
              </div>
            ))}
          </HorizontalScroll>
        </section>
      )}

      {/* ─── Недавние отзывы ─── */}
      {recentReviews.length > 0 && (
        <section>
          <SectionHeader
            Icon={MessageCircle}
            title="Недавние отзывы"
            href="/library"
            count={watchedCount}
          />
          <div className="space-y-3">
            {recentReviews.map((entry) => (
              <ReviewPreview
                key={entry.id}
                title={entry.drama.title}
                year={entry.drama.year || 0}
                rating={entry.rating || 0}
                cryTag={entry.cryTag || "safe"}
                excerpt={entry.review || entry.impression || ""}
                date={new Date(entry.updatedAt).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "short",
                })}
                posterUrl={entry.drama.posterUrl}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── Карточка зрителя ─── */}
      <section>
        <SectionHeader
          Icon={User}
          title="Карточка зрителя"
          href="/me"
          count={null}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ViewerCard
            Icon={Heart}
            column="Любит"
            tone="like"
            items={[
              "Дорамы, оставляющие пространство для выводов",
              "Сюжеты, где нужно ставить на паузу и вести расследование",
              "Эксцентричные, яркие главные героини",
              "Микс жанров: романтика + детектив + фэнтези",
            ]}
          />
          <ViewerCard
            Icon={Ban}
            column="Не заходит"
            tone="dislike"
            items={[
              "Скучные, вялые сюжеты",
              "Азиатский гипертрофированный юмор",
              "Недостаток романтики там, где она уместна",
            ]}
          />
          <ViewerCard
            Icon={StickyNote}
            column="Отметки"
            tone="note"
            items={[
              "Иногда выбирает дни, чтобы поплакать",
              "Любит обсуждать и разгадывать сюжет",
              "Пишет отзывы на эмоциях, без лишних слов, но с сутью",
            ]}
          />
        </div>
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────── */
/*  Компоненты                                  */
/* ──────────────────────────────────────────── */

function SectionHeader({
  Icon,
  title,
  href,
  count,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  href: string;
  count: number | null;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Icon className="w-5 h-5 text-accent" />
        <span>{title}</span>
        {count !== null && (
          <span className="text-sm text-muted font-normal">({count})</span>
        )}
      </h2>
      <Link href={href} className="text-sm text-accent hover:underline shrink-0">
        все →
      </Link>
    </div>
  );
}

function HeartPreview({
  title,
  year,
  quote,
}: {
  title: string;
  year: number;
  quote: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 border-l-4 border-l-yellow-400/70 h-full">
      <div className="flex items-baseline justify-between mb-2">
        {/* Оборачиваем в Link только заголовок */}
        <Link
          href="/heart"
          className="group flex items-center gap-1.5 hover:text-accent transition-colors"
        >
          <Crown className="w-4 h-4 text-yellow-400" />
          <h3 className="font-bold text-sm">
            {title}
          </h3>
        </Link>
        <span className="text-xs text-muted">{year}</span>
      </div>
      <p className="text-sm text-muted italic leading-relaxed line-clamp-3">
        «{quote}»
      </p>
    </div>
  );
}

function ReviewPreview({
  title,
  year,
  rating,
  cryTag,
  excerpt,
  date,
  posterUrl,
}: {
  title: string;
  year: number;
  rating: number;
  cryTag: string;
  excerpt: string;
  date: string;
  posterUrl?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex gap-4">
      <div className="w-16 h-24 rounded-lg overflow-hidden bg-accent-soft/40 flex items-center justify-center text-2xl shrink-0">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-muted">🎬</span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2 flex-wrap">
          <h3 className="font-semibold">
            {title}{" "}
            <span className="text-muted font-normal text-sm">({year})</span>
          </h3>
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-sm text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              {rating}
            </span>
            <CryBadge tag={cryTag} size="sm" />
            <span className="text-muted text-xs">{date}</span>
          </div>
        </div>
        <p className="text-sm text-muted mt-1.5 leading-relaxed line-clamp-2">
          {excerpt}
        </p>
      </div>
    </div>
  );
}

function ViewerCard({
  column,
  tone,
  items,
  Icon,
}: {
  column: string;
  tone: "like" | "dislike" | "note";
  items: string[];
  Icon: React.ComponentType<{ className?: string }>;
}) {
  const accent = {
    like: "text-green-400",
    dislike: "text-red-400",
    note: "text-muted",
  }[tone];
  const BulletIcon = {
    like: Check,
    dislike: X,
    note: Circle,
  }[tone];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-accent" />
        {column}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2">
            <BulletIcon className={`w-4 h-4 mt-0.5 shrink-0 ${accent}`} />
            <span className="text-muted leading-snug">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
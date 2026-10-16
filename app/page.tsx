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
} from "lucide-react";
import { YearHeatmap } from "@/components/YearHeatmap";
import { LibraryBar } from "@/components/LibraryBar";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      {/* ─── Приветствие ─── */}
      <section className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-accent-soft flex items-center justify-center text-3xl shrink-0">
          🎬
        </div>
        <div>
          <h1 className="text-2xl font-bold">Привет, Артём</h1>
          <p className="text-muted text-sm mt-1">
            в дневнике с октября 2026 · 31 просмотрено · 34 в планах
          </p>
        </div>
      </section>

      {/* ─── Статистика ─── */}
   <LibraryBar
  counts={{
    watched: 31,
    watching: 6,
    planned: 34,
    on_hold: 5,
    dropped: 5,
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
        <YearHeatmap activities={demoActivities} />
      </section>

      {/* ─── Особое место ─── */}
      <section>
        <SectionHeader
          Icon={Crown}
          title="Особое место в сердце"
          href="/heart"
          count={7}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <HeartPreview
            title="Мышь"
            year={2021}
            quote="Дорама, которая даёт тебе шанс побыть детективом, но как бы ты ни старался, ответы ты получишь лишь в конце"
          />
          <HeartPreview
            title="Отель Дель Луна"
            year={2019}
            quote="Желаю всем найти такого человека, которого хотелось бы любить спустя тысячелетия"
          />
          <HeartPreview
            title="Псих, но всё в порядке"
            year={2020}
            quote="Многое хотелось бы сказать, но скажу лишь одно: я ОБОЖАЮ таких девушек, как главная героиня"
          />
        </div>
      </section>

      {/* ─── Недавние отзывы ─── */}
      <section>
        <SectionHeader
          Icon={MessageCircle}
          title="Недавние отзывы"
          href="/library"
          count={31}
        />
        <div className="space-y-3">
          <ReviewPreview
            title="Жена принца XXI века"
            year={2026}
            rating={10}
            cryTag="safe"
            excerpt="Вы такого не видели. Короли и королевы, принцы и регенты, а через дорогу наш привычный XXI век. Я обожаю эту актрису — она не играет роль, она играет саму себя. Это было волшебно."
            date="12 окт"
          />
          <ReviewPreview
            title="Игра: Стремление к нулю"
            year={2020}
            rating={9}
            cryTag="bittersweet"
            excerpt="Никогда бы не подумал, что знать смерть других, но не знать как умрёт любимая — станет для меня проклятием."
            date="8 окт"
          />
          <ReviewPreview
            title="Силачка До Бон Сун"
            year={2017}
            rating={10}
            cryTag="bittersweet"
            excerpt="Комично и романтично. Хотите вспомнить себя, когда вы были влюблённым подростком — понаблюдайте за главным героем."
            date="4 окт"
          />
        </div>
      </section>

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

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-3 text-center">
      <p className={`text-xl font-bold ${accent ? "text-accent" : ""}`}>{value}</p>
      <p className="text-[11px] text-muted mt-1 leading-tight">{label}</p>
    </div>
  );
}

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
    <div className="rounded-2xl border border-border bg-surface p-4 border-l-4 border-l-yellow-400/70">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-bold text-sm flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-yellow-400" />
          {title}
        </h3>
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
  posterUrl?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4 flex gap-4">
      {/* Постер */}
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


/* ──────────────────────────────────────────── */
/*  Демо-данные                                 */
/* ──────────────────────────────────────────── */

const demoActivities = [
  // ─── 2024 ───
  { date: "2024-02-14", level: 3, episodes: 4, dramaTitle: "Мышь" },
  { date: "2024-03-08", level: 2, episodes: 3, dramaTitle: "Сигнал" },
  { date: "2024-04-20", level: 4, episodes: 6, dramaTitle: "Монстр" },
  { date: "2024-05-15", level: 2, episodes: 3, dramaTitle: "Тоннель" },
  { date: "2024-06-10", level: 1, episodes: 2, dramaTitle: "Меморист" },
  { date: "2024-08-05", level: 3, episodes: 4, dramaTitle: "Болтун" },
  { date: "2024-09-22", level: 2, episodes: 3, dramaTitle: "Кайрос" },
  { date: "2024-11-11", level: 4, episodes: 5, dramaTitle: "19 этаж" },
  { date: "2024-12-25", level: 1, episodes: 2, dramaTitle: "Начало" },

  // ─── 2025 ───
  { date: "2025-01-07", level: 2, episodes: 3, dramaTitle: "Отель Дель Луна" },
  { date: "2025-02-14", level: 4, episodes: 5, dramaTitle: "Псих, но всё в порядке" },
  { date: "2025-03-20", level: 3, episodes: 4, dramaTitle: "Киберкраш" },
  { date: "2025-04-05", level: 2, episodes: 3, dramaTitle: "Силачка До Бон Сун" },
  { date: "2025-05-18", level: 4, episodes: 6, dramaTitle: "Что случилось с секретарём Ким?" },
  { date: "2025-06-30", level: 2, episodes: 3, dramaTitle: "Король земли" },
  { date: "2025-08-12", level: 3, episodes: 4, dramaTitle: "Деловое предложение" },
  { date: "2025-09-25", level: 2, episodes: 3, dramaTitle: "Мой демон" },
  { date: "2025-10-10", level: 4, episodes: 5, dramaTitle: "Жена принца XXI века" },
  { date: "2025-11-20", level: 1, episodes: 2, dramaTitle: "С сегодняшнего дня я человек" },
  { date: "2025-12-15", level: 3, episodes: 4, dramaTitle: "Игра: Стремление к нулю" },

  // ─── 2026 (текущий) ───
  { date: "2026-01-05", level: 1, episodes: 2, dramaTitle: "Мышь" },
  { date: "2026-01-12", level: 2, episodes: 3, dramaTitle: "Мышь" },
  { date: "2026-01-19", level: 1, episodes: 1, dramaTitle: "Сигнал" },
  { date: "2026-02-03", level: 3, episodes: 4, dramaTitle: "Сигнал" },
  { date: "2026-02-10", level: 2, episodes: 2, dramaTitle: "Тоннель" },
  { date: "2026-03-08", level: 4, episodes: 6, dramaTitle: "Монстр" },
  { date: "2026-03-15", level: 2, episodes: 3, dramaTitle: "Монстр" },
  { date: "2026-04-18", level: 3, episodes: 4, dramaTitle: "Болтун" },
  { date: "2026-05-10", level: 2, episodes: 3, dramaTitle: "Игра: Стремление к нулю" },
  { date: "2026-07-12", level: 4, episodes: 5, dramaTitle: "19 этаж" },
  { date: "2026-08-05", level: 3, episodes: 4, dramaTitle: "Отель Дель Луна" },
  { date: "2026-08-22", level: 2, episodes: 2, dramaTitle: "Отель Дель Луна" },
  { date: "2026-09-10", level: 1, episodes: 2, dramaTitle: "Псих, но всё в порядке" },
  { date: "2026-09-28", level: 3, episodes: 4, dramaTitle: "Киберкраш" },
  { date: "2026-10-04", level: 2, episodes: 3, dramaTitle: "Силачка До Бон Сун" },
  { date: "2026-10-08", level: 3, episodes: 4, dramaTitle: "Силачка До Бон Сун" },
  { date: "2026-10-12", level: 4, episodes: 5, dramaTitle: "Жена принца XXI века" },
];
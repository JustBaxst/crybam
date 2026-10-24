import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> На главную
      </Link>

      <h1 className="text-3xl font-bold mb-6">О проекте Crybam</h1>

      <div className="space-y-6 text-muted leading-relaxed">
        <p>
          <strong className="text-foreground">Crybam</strong> — это личный дневник для тех, кто любит дорамы.
          Здесь можно отмечать просмотренное, писать отзывы, сохранять цитаты и строить свой портрет зрителя.
        </p>

        <p>
          Название <strong>Crybam</strong> состоит из двух частей: <em>Cry</em> (от английского «плакать»)
          и <em>bam</em> (от корейского «한밤» — «глубокая ночь»). Вместе — «ночь, когда хочется плакать над дорамой».
          Корейская надпись <strong>눈물밤</strong> означает «ночь слёз».
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Источники данных</h2>
        <p>
          Постеры и метаданные предоставлены TVmaze API.
        </p>

        <h2 className="text-xl font-semibold text-foreground pt-4">Авторские права</h2>
        <p>
          Постеры и изображения принадлежат их правообладателям и используются исключительно в иллюстративных целях
          для идентификации произведений.
        </p>
        <p>
          Если вы являетесь правообладателем и хотите убрать контент — свяжитесь с нами.
        </p>
      </div>
    </div>
  );
}
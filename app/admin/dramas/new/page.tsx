import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NewDramaForm } from "./NewDramaForm";

export default function NewDramaPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link
        href="/admin/dramas"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад к списку дорам
      </Link>

      <h1 className="text-2xl font-bold mb-2">Новая дорама</h1>
      <p className="text-sm text-muted mb-8">
        Заполни минимум — название. Остальные поля можно добавить позже
        на странице редактирования.
      </p>

      <NewDramaForm />
    </div>
  );
}
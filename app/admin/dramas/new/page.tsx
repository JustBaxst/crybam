import { NewDramaForm } from "./NewDramaForm";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";

export default function NewDramaPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Хлебные крошки заменили кнопку "Назад" */}
      <AdminBreadcrumbs items={[{ label: "Дорамы", href: "/admin/dramas" }, { label: "Создание" }]} />

      <h1 className="text-2xl font-bold mb-2">Новая дорама</h1>
      <p className="text-sm text-muted mb-8">
        Заполни минимум — название. Остальные поля можно добавить позже
        на странице редактирования.
      </p>

      <NewDramaForm />
    </div>
  );
}
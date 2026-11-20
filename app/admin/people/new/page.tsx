import { PersonForm } from "../PersonForm";
import { AdminBreadcrumbs } from "@/components/AdminBreadcrumbs";
import { createPerson } from "../actions";

export default function NewPersonPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <AdminBreadcrumbs
        items={[
          { label: "Актёры", href: "/admin/people" },
          { label: "Создание" },
        ]}
      />
      <h1 className="text-2xl font-bold mb-6">Новый человек</h1>
      <PersonForm action={createPerson} />
    </div>
  );
}

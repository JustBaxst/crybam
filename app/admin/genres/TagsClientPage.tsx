"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Tag, Smile, Hash, X, Save } from "lucide-react";
import { createTaxonomyItems, deleteTaxonomyItem } from "./actions";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { FormInput, FormSelect } from "@/components/ui/form-elements";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { toast } from "sonner";

type Item = { id: number; name: string; _count: { dramas: number } };
type TaxonomyType = "genre" | "mood" | "theme";

// ─── МОДАЛКА ДОБАВЛЕНИЯ ───
function AddTaxonomyModal({
  initialType,
  onClose,
}: {
  initialType: TaxonomyType;
  onClose: () => void;
}) {
  useLockBodyScroll();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TaxonomyType>(initialType);
  const [names, setNames] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.trim()) return;

    startTransition(async () => {
      const res = await createTaxonomyItems(type, names);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(
          `Добавлено: ${res.created}, восстановлено: ${res.restored}`,
        );
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Добавить в справочник</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-border hover:border-accent/40 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Куда добавляем?
            </label>
            <FormSelect
              value={type}
              onChange={(e) => setType(e.target.value as TaxonomyType)}
            >
              <option value="genre">Жанры</option>
              <option value="mood">Настроения</option>
              <option value="theme">Темы</option>
            </FormSelect>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Названия (через запятую)
            </label>
            <FormInput
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="Романтика, Комедия, Драма..."
              autoFocus
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-sm hover:border-accent/40 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isPending || !names.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            <Save className="w-4 h-4" />
            {isPending ? "Сохранение..." : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── ОСНОВНАЯ СТРАНИЦА ───
export function TagsClientPage({
  genres,
  moods,
  themes,
}: {
  genres: Item[];
  moods: Item[];
  themes: Item[];
}) {
  const [activeTab, setActiveTab] = useState<TaxonomyType>("genre");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentData =
    activeTab === "genre" ? genres : activeTab === "mood" ? moods : themes;

  const handleDelete = (id: number, name: string, count: number) => {
    if (count > 0) {
      if (
        !confirm(
          `«${name}» используется в ${count} дорамах. Удалить его из общего списка? (В дорамах он останется, но пропадёт из фильтров)`,
        )
      )
        return;
    } else {
      if (!confirm(`Удалить «${name}»?`)) return;
    }

    startTransition(async () => {
      const res = await deleteTaxonomyItem(activeTab, id);
      if (res.error) toast.error(res.error);
      else toast.success("Удалено");
    });
  };

  const getIcon = () => {
    if (activeTab === "genre") return <Tag className="w-5 h-5" />;
    if (activeTab === "mood") return <Smile className="w-5 h-5" />;
    return <Hash className="w-5 h-5" />;
  };

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TaxonomyType)}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <TabsList className="mb-0">
            <TabsTrigger value="genre" className="flex items-center gap-2">
              <Tag className="w-4 h-4" /> Жанры ({genres.length})
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <Smile className="w-4 h-4" /> Настроения ({moods.length})
            </TabsTrigger>
            <TabsTrigger value="theme" className="flex items-center gap-2">
              <Hash className="w-4 h-4" /> Темы ({themes.length})
            </TabsTrigger>
          </TabsList>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 h-9 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        <div className="bg-surface/20 p-6 rounded-2xl border border-border/50">
          <div className="w-full max-w-md mb-6">
            <AdminSearchBar placeholder="Поиск по названию..." />
          </div>

          {currentData.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-border rounded-xl text-muted italic">
              Ничего не найдено.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-accent/40 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-accent shrink-0">{getIcon()}</span>
                    <span className="font-medium truncate text-sm">
                      {item.name}
                    </span>
                    {item._count.dramas > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface border border-border text-muted shrink-0">
                        {item._count.dramas}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      handleDelete(item.id, item.name, item._count.dramas)
                    }
                    disabled={isPending}
                    className="p-1.5 rounded-md text-muted hover:text-danger hover:bg-danger/10 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Tabs>

      {isModalOpen && (
        <AddTaxonomyModal
          initialType={activeTab}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Plus, Trash2, Tag, Smile, Hash } from "lucide-react";
import { createTaxonomyItem, deleteTaxonomyItem } from "./actions";
import { toast } from "sonner";

type Item = { id: number; name: string; _count: { dramas: number } };
type TaxonomyType = "genre" | "mood" | "theme";

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
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [isPending, startTransition] = useTransition();

  const currentData =
    activeTab === "genre" ? genres : activeTab === "mood" ? moods : themes;
  const filteredData = currentData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    startTransition(async () => {
      const res = await createTaxonomyItem(activeTab, newName);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Добавлено");
        setNewName("");
      }
    });
  };

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
    <Tabs
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as TaxonomyType)}
      className="w-full"
    >
      <TabsList className="mb-6">
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

      <div className="bg-surface/20 p-6 rounded-2xl border border-border/50">
        {/* Панель поиска и добавления */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по названию..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none text-sm transition-colors"
            />
          </div>
          <form onSubmit={handleCreate} className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Новое название..."
              className="w-full md:w-64 px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none text-sm transition-colors"
            />
            <button
              type="submit"
              disabled={isPending || !newName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Plus className="w-4 h-4" /> Добавить
            </button>
          </form>
        </div>

        {/* Сетка карточек */}
        {filteredData.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl text-muted italic">
            Ничего не найдено.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredData.map((item) => (
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
  );
}

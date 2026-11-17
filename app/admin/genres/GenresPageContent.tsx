"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Plus, Trash2, Tag, Smile, Hash, X, Save } from "lucide-react";
import {
  createTaxonomyItems,
  deleteTaxonomyItem,
  updateTaxonomyItem,
} from "./actions";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { FormInput, FormSelect } from "@/components/ui/form-elements";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { useLockBodyScroll } from "@/lib/use-lock-body-scroll";
import { toast } from "sonner";

type Item = { id: number; name: string; _count: { dramas: number } };
type TaxonomyType = "genre" | "mood" | "theme";

// ─── МОДАЛКА ДОБАВЛЕНИЯ ───
function TaxonomyModal({
  mode,
  initialType = "genre",
  initialName = "",
  itemId,
  onClose,
}: {
  mode: "create" | "edit";
  initialType?: TaxonomyType;
  initialName?: string;
  itemId?: number;
  onClose: () => void;
}) {
  useLockBodyScroll();
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TaxonomyType>(initialType);
  const [names, setNames] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!names.trim()) return;

    startTransition(async () => {
      let res;
      if (mode === "create") {
        res = await createTaxonomyItems(type, names);
      } else {
        res = await updateTaxonomyItem(type, itemId!, names);
      }

      if (res.error) toast.error(res.error);
      else {
        toast.success(mode === "create" ? `Добавлено` : "Обновлено");
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {mode === "create" ? "Добавить в справочник" : "Редактировать"}
          </h2>
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
              Тип справочника
            </label>
            <FormSelect
              value={type}
              onChange={(e) => setType(e.target.value as TaxonomyType)}
              disabled={mode === "edit"} // При редактировании нельзя поменять тип
            >
              <option value="genre">Жанры</option>
              <option value="mood">Настроения</option>
              <option value="theme">Темы</option>
            </FormSelect>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              {mode === "create" ? "Названия (через запятую)" : "Название"}
            </label>
            <FormInput
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder={
                mode === "create" ? "Романтика, Комедия..." : "Название"
              }
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
export function GenresPageContent({
  genres,
  moods,
  themes,
  totalCount,
  currentFilter,
}: {
  genres: Item[];
  moods: Item[];
  themes: Item[];
  totalCount: number;
  currentFilter: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const [editItem, setEditItem] = useState<{
    type: TaxonomyType;
    id: number;
    name: string;
  } | null>(null);

  const handleDelete = (
    type: TaxonomyType,
    id: number,
    name: string,
    count: number,
  ) => {
    if (count > 0) {
      if (
        !confirm(
          `«${name}» используется в ${count} дорамах. Удалить его из общего списка?`,
        )
      )
        return;
    } else {
      if (!confirm(`Удалить «${name}»?`)) return;
    }

    startTransition(async () => {
      const res = await deleteTaxonomyItem(type, id);
      if (res.error) toast.error(res.error);
      else toast.success("Удалено");
    });
  };

  const renderTable = (items: Item[], type: TaxonomyType) => {
    if (items.length === 0) {
      return (
        <div className="px-6 py-8 text-center text-sm text-muted italic">
          Ничего не найдено
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-125">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                Название
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                Использований
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted uppercase tracking-wide">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border last:border-b-0 hover:bg-foreground/2 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {type === "genre" && (
                      <Tag className="w-4 h-4 text-accent shrink-0" />
                    )}
                    {type === "mood" && (
                      <Smile className="w-4 h-4 text-accent shrink-0" />
                    )}
                    {type === "theme" && (
                      <Hash className="w-4 h-4 text-accent shrink-0" />
                    )}
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted">
                  {item._count.dramas > 0 ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface border border-border text-xs">
                      {item._count.dramas} дорам
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {/* Используем ActionDropdown для стиля, как в других таблицах */}
                  <div className="flex justify-end">
                    <ActionDropdown
                      onEditClick={() =>
                        setEditItem({ type, id: item.id, name: item.name })
                      }
                      onDeleteClick={() =>
                        handleDelete(
                          type,
                          item.id,
                          item.name,
                          item._count.dramas,
                        )
                      }
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* ВЕРХНИЙ РЯД */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Справочники
            <span className="text-sm font-normal text-muted bg-surface px-2 py-0.5 rounded-full border border-border">
              {totalCount}
            </span>
          </h1>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Добавить
        </button>
      </div>

      {/* ПОИСК И ЧИПСЫ */}
      <div className="flex flex-col gap-3">
        <div className="w-full max-w-2xl">
          <AdminSearchBar placeholder="Поиск по названиям..." />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 [&::-webkit-scrollbar]:hidden">
          {[
            { key: "", label: "Все" },
            { key: "genre", label: "Только жанры" },
            { key: "mood", label: "Только настроения" },
            { key: "theme", label: "Только темы" },
          ].map((f) => {
            const isActive = currentFilter === f.key;
            const params = new URLSearchParams();
            const q = searchParams.get("q");
            if (q) params.set("q", q);
            if (!isActive && f.key) params.set("filter", f.key);

            return (
              <Link
                key={f.key}
                href={`/admin/genres?${params.toString()}`}
                className={`px-3 py-1 rounded-full text-xs transition-colors shrink-0 border-none ${
                  isActive
                    ? "bg-accent text-white"
                    : "bg-transparent text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* АККОРДЕОН С ТАБЛИЦАМИ */}
      <Accordion
        type="multiple"
        defaultValue={["genre", "mood", "theme"]}
        className="w-full flex flex-col gap-4"
      >
        {(!currentFilter || currentFilter === "genre") && (
          <AccordionItem
            value="genre"
            className="bg-surface/20 border border-border/50 rounded-2xl overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-surface/30 transition-colors">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Tag className="w-5 h-5 text-accent" /> Жанры
                <span className="text-sm font-normal text-muted bg-background px-2 py-0.5 rounded-full border border-border ml-1">
                  {genres.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/50">
              {renderTable(genres, "genre")}
            </AccordionContent>
          </AccordionItem>
        )}

        {(!currentFilter || currentFilter === "mood") && (
          <AccordionItem
            value="mood"
            className="bg-surface/20 border border-border/50 rounded-2xl overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-surface/30 transition-colors">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Smile className="w-5 h-5 text-accent" /> Настроения
                <span className="text-sm font-normal text-muted bg-background px-2 py-0.5 rounded-full border border-border ml-1">
                  {moods.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/50">
              {renderTable(moods, "mood")}
            </AccordionContent>
          </AccordionItem>
        )}

        {(!currentFilter || currentFilter === "theme") && (
          <AccordionItem
            value="theme"
            className="bg-surface/20 border border-border/50 rounded-2xl overflow-hidden"
          >
            <AccordionTrigger className="px-6 py-4 hover:bg-surface/30 transition-colors">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Hash className="w-5 h-5 text-accent" /> Темы
                <span className="text-sm font-normal text-muted bg-background px-2 py-0.5 rounded-full border border-border ml-1">
                  {themes.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t border-border/50">
              {renderTable(themes, "theme")}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {isModalOpen && (
        <TaxonomyModal mode="create" onClose={() => setIsModalOpen(false)} />
      )}

      {editItem && (
        <TaxonomyModal
          mode="edit"
          initialType={editItem.type}
          initialName={editItem.name}
          itemId={editItem.id}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  );
}

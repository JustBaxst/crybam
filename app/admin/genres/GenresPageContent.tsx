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
import { Plus, Trash2, Tag, Smile, Hash, AlertCircle } from "lucide-react";
import {
  createTaxonomyItems,
  deleteTaxonomyItem,
  updateTaxonomyItem,
} from "./actions";
import { AdminSearchBar } from "@/components/AdminSearchBar";
import { FormField, FormInput } from "@/components/ui/form-elements";
import { ActionDropdown } from "@/components/admin/ActionDropdown";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Item = { id: number; name: string; _count: { dramas: number } };
type TaxonomyType = "genre" | "mood" | "theme";

// ─── МОДАЛКА ДОБАВЛЕНИЯ / РЕДАКТИРОВАНИЯ ───
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
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<TaxonomyType>(initialType);
  const [names, setNames] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  // Считаем, изменил ли пользователь данные (для защиты от закрытия)
  const isDirty = names !== initialName || (mode === "create" && names !== "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!names.trim()) {
      setError("Введите хотя бы одно название");
      return;
    }
    if (mode === "edit" && names.trim().length < 2) {
      setError("Название должно быть не короче 2 символов");
      return;
    }

    startTransition(async () => {
      let res;
      if (mode === "create") {
        res = await createTaxonomyItems(type, names);
      } else {
        res = await updateTaxonomyItem(type, itemId!, names);
      }

      if (res.error) {
        setError(res.error);
      } else {
        toast.success(mode === "create" ? `Добавлено` : "Обновлено");
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={mode === "create" ? "Добавить в справочник" : "Редактировать"}
      icon={
        mode === "create" ? (
          <Plus className="w-5 h-5" />
        ) : (
          <Tag className="w-5 h-5" />
        )
      }
      isDirty={isDirty}
      isPending={isPending}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isPending || !names.trim()}
          >
            {isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Тип справочника">
          <Select
            value={type}
            onChangeAction={(val) => setType(val as TaxonomyType)}
            options={[
              { value: "genre", label: "Жанры" },
              { value: "mood", label: "Настроения" },
              { value: "theme", label: "Темы" },
            ]}
            disabled={mode === "edit"} // При редактировании нельзя поменять тип
          />
        </FormField>

        <FormField
          label={mode === "create" ? "Названия (через запятую)" : "Название"}
          required
        >
          <FormInput
            value={names}
            onChange={(e) => setNames(e.target.value)}
            placeholder={
              mode === "create" ? "Романтика, Комедия..." : "Название"
            }
            autoFocus
            maxLength={50}
            className={error ? "border-danger focus:border-danger" : ""}
          />
          {error && (
            <p className="text-danger text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {error}
            </p>
          )}
        </FormField>
      </div>
    </Modal>
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
  const [editItem, setEditItem] = useState<{
    type: TaxonomyType;
    id: number;
    name: string;
  } | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    type: TaxonomyType;
    id: number;
    name: string;
    count: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();

  const handleDelete = () => {
    if (!deleteItem) return;
    startTransition(async () => {
      const res = await deleteTaxonomyItem(deleteItem.type, deleteItem.id);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Удалено");
        setDeleteItem(null);
      }
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
                  <div className="flex justify-end">
                    <ActionDropdown
                      onEditClick={() =>
                        setEditItem({ type, id: item.id, name: item.name })
                      }
                      onDeleteClick={() =>
                        setDeleteItem({
                          type,
                          id: item.id,
                          name: item.name,
                          count: item._count.dramas,
                        })
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

      {/* Модалки */}
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

      {deleteItem && (
        <ConfirmDialog
          isOpen={true}
          onCloseAction={() => setDeleteItem(null)}
          onConfirmAction={handleDelete}
          title={`Удалить ${deleteItem.type === "genre" ? "жанр" : deleteItem.type === "mood" ? "настроение" : "тему"}?`}
          description={
            deleteItem.count > 0
              ? `«${deleteItem.name}» используется в ${deleteItem.count} дорамах. Он исчезнет из фильтров, но останется в самих дорамах.`
              : `Вы уверены, что хотите удалить «${deleteItem.name}»?`
          }
          confirmText="Удалить"
          isPending={isPending}
        />
      )}
    </>
  );
}

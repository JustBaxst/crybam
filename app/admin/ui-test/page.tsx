"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  FormField,
  FormInput,
  FormTextarea,
  FormSelect,
} from "@/components/ui/form-elements";
import { Button } from "@/components/ui/button";
import { Save, Trash2, LayoutPanelLeft, Square } from "lucide-react";

export default function UiTestPage() {
  const [modalVariant, setModalVariant] = useState<"center" | "drawer" | null>(
    null,
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const openModal = (variant: "center" | "drawer") => {
    setModalVariant(variant);
    setIsDirty(false);
  };

  const handleSave = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setModalVariant(null);
      alert("Сохранено!");
    }, 1000);
  };

  const handleDelete = () => {
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setShowDelete(false);
      alert("Удалено!");
    }, 1000);
  };

  const MockForm = (
    <div className="space-y-4">
      <FormField label="Название дорамы" required>
        <FormInput
          placeholder="Например: Жена принца XXI века"
          onChange={() => setIsDirty(true)}
        />
      </FormField>
      <FormField label="Год">
        <FormInput
          type="number"
          placeholder="2026"
          onChange={() => setIsDirty(true)}
        />
      </FormField>
      <FormField label="Описание">
        <FormTextarea
          rows={5}
          placeholder="Введите синопсис..."
          onChange={() => setIsDirty(true)}
        />
      </FormField>
      <FormField label="Статус">
        <FormSelect onChange={() => setIsDirty(true)}>
          <option value="released">Вышел</option>
          <option value="ongoing">Выходит</option>
        </FormSelect>
      </FormField>
      {/* Искусственно удлиняем форму для проверки скролла */}
      <div className="h-64 border border-dashed border-border rounded-xl flex items-center justify-center text-muted text-sm">
        (Здесь просто пустое место, чтобы проверить скролл)
      </div>
    </div>
  );

  const MockFooter = (
    <>
      <Button variant="outline" onClick={() => setModalVariant(null)}>
        Отмена
      </Button>
      <Button onClick={handleSave} disabled={isPending}>
        <Save className="w-4 h-4 mr-2" />
        {isPending ? "Сохранение..." : "Сохранить"}
      </Button>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Тест UI-компонентов</h1>
        <p className="text-muted text-sm mt-1">
          Проверка нового универсального окна (Modal) и подтверждений.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => openModal("center")}
          className="p-6 bg-surface/20 border border-border/50 rounded-2xl flex flex-col items-center gap-3 hover:border-accent transition-colors"
        >
          <Square className="w-8 h-8 text-accent" />
          <span className="font-semibold text-sm">Модалка по центру</span>
        </button>

        <button
          onClick={() => openModal("drawer")}
          className="p-6 bg-surface/20 border border-border/50 rounded-2xl flex flex-col items-center gap-3 hover:border-accent transition-colors"
        >
          <LayoutPanelLeft className="w-8 h-8 text-accent" />
          <span className="font-semibold text-sm">Выезжающая панель</span>
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="p-6 bg-surface/20 border border-border/50 rounded-2xl flex flex-col items-center gap-3 hover:border-danger/50 transition-colors"
        >
          <Trash2 className="w-8 h-8 text-danger" />
          <span className="font-semibold text-sm">Окно удаления</span>
        </button>
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={modalVariant !== null}
        onClose={() => setModalVariant(null)}
        title={
          modalVariant === "drawer"
            ? "Редактирование (Панель)"
            : "Редактирование (Центр)"
        }
        variant={modalVariant || "center"}
        isDirty={isDirty}
        isPending={isPending}
        footer={MockFooter}
      >
        {MockForm}
      </Modal>

      {/* Окно удаления */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Удалить дораму?"
        description="Это действие нельзя отменить. Дорама и все её связи будут скрыты из системы."
        isPending={isPending}
      />
    </div>
  );
}

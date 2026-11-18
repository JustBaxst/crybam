"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/ui/form-elements";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Square, Pencil, AlertCircle } from "lucide-react";

export default function UiTestPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // Состояние формы
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [status, setStatus] = useState("released");
  const [description, setDescription] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  // Отслеживаем изменения (для защиты от закрытия)
  const isDirty =
    title !== "" || year !== "" || description !== "" || status !== "released";

  const handleSave = () => {
    if (!title.trim() || !year.trim()) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);
    setIsPending(true);
    setTimeout(() => {
      setIsPending(false);
      setModalOpen(false);
      // Сбрасываем форму
      setTitle("");
      setYear("");
      setDescription("");
      setStatus("released");
      alert("Успешно сохранено!");
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Тест UI-компонентов (v2)</h1>
        <p className="text-muted text-sm mt-1">
          Проверка валидации, кастомного селекта и иконок.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setModalOpen(true)}
          className="p-6 bg-surface/20 border border-border/50 rounded-2xl flex flex-col items-center gap-3 hover:border-accent transition-colors"
        >
          <Square className="w-8 h-8 text-accent" />
          <span className="font-semibold text-sm">
            Открыть форму (Валидация)
          </span>
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="p-6 bg-surface/20 border border-border/50 rounded-2xl flex flex-col items-center gap-3 hover:border-danger/50 transition-colors"
        >
          <Trash2 className="w-8 h-8 text-danger" />
          <span className="font-semibold text-sm">
            Окно удаления (Компактное)
          </span>
        </button>
      </div>

      {/* Модалка с формой */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Редактирование дорамы"
        icon={<Pencil className="w-5 h-5" />}
        isDirty={isDirty}
        isPending={isPending}
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSave} disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Название дорамы" required>
            <FormInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Жена принца XXI века"
              className={
                showErrors && !title.trim()
                  ? "border-danger focus:border-danger"
                  : ""
              }
            />
            {showErrors && !title.trim() && (
              <p className="text-danger text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Поле обязательно для
                заполнения
              </p>
            )}
          </FormField>

          <FormField label="Год" required>
            <FormInput
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className={
                showErrors && !year.trim()
                  ? "border-danger focus:border-danger"
                  : ""
              }
            />
            {showErrors && !year.trim() && (
              <p className="text-danger text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Поле обязательно для
                заполнения
              </p>
            )}
          </FormField>

          <FormField label="Статус">
            <Select
              value={status}
              onChange={setStatus}
              options={[
                { value: "released", label: "Вышел" },
                { value: "ongoing", label: "Выходит" },
                { value: "announced", label: "Анонс" },
              ]}
            />
          </FormField>

          <FormField label="Описание">
            <FormTextarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите синопсис..."
            />
          </FormField>
        </div>
      </Modal>

      {/* Окно удаления */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Удалить дораму?"
        description="Это действие нельзя отменить. Дорама и все её связи будут скрыты из системы."
        confirmText="Удалить навсегда"
        isPending={isPending}
      />
    </div>
  );
}

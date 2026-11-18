"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";

/**
 * Универсальное окно подтверждения (удаление, несохраненные данные).
 * @dontDuplicate Не использовать нативный confirm().
 */
export function ConfirmDialog({
  isOpen,
  onCloseAction,
  onConfirmAction,
  title,
  description,
  confirmText = "Подтвердить",
  variant = "danger", // danger | warning
  isPending = false,
}: {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => void;
  title: string;
  description: string;
  confirmText?: string;
  variant?: "danger" | "warning";
  isPending?: boolean;
}) {
  const isDanger = variant === "danger";

  return (
    <Modal
      isOpen={isOpen}
      onCloseAction={onCloseAction}
      title={title}
      variant="center"
      isPending={isPending}
      maxWidth="max-w-md" // Делаем окно компактным
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onCloseAction}
            disabled={isPending}
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant={isDanger ? "destructive" : "default"}
            onClick={onConfirmAction}
            disabled={isPending}
          >
            {isPending ? "Загрузка..." : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
            isDanger ? "bg-danger/10 text-danger" : "bg-warning/10 text-warning"
          }`}
        >
          {isDanger ? (
            <Trash2 className="w-6 h-6" />
          ) : (
            <AlertTriangle className="w-6 h-6" />
          )}
        </div>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </Modal>
  );
}

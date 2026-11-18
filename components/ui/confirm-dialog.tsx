"use client";

import { AlertTriangle } from "lucide-react";
import { Modal } from "./modal";
import { Button } from "./button";

/**
 * Универсальное окно подтверждения (для удаления и опасных действий).
 * @dontDuplicate Не использовать нативный confirm().
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Подтверждение",
  description,
  confirmText = "Удалить",
  isPending = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description: string;
  confirmText?: string;
  isPending?: boolean;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="center"
      isPending={isPending}
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
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Удаление..." : confirmText}
          </Button>
        </>
      }
    >
      <div className="flex flex-col items-center text-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>
    </Modal>
  );
}

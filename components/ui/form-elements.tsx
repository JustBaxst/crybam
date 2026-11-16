import {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { AlertCircle } from "lucide-react";

/**
 * Обертка для поля формы (Лейбл + Инпут + Подсказка).
 * @dontDuplicate Не верстай лейблы и отступы вручную в каждой форме.
 */
export function FormField({
  label,
  required,
  description,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-muted mb-1.5">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-[11px] text-muted/70 mt-1.5">{description}</p>
      )}
    </div>
  );
}

/**
 * Базовый текстовый инпут.
 */
export function FormInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm ${className}`}
      {...props}
    />
  );
}

/**
 * Базовый селект (выпадающий список).
 */
export function FormSelect({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm ${className}`}
      {...props}
    />
  );
}

/**
 * Базовая текстовая область.
 */
export function FormTextarea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full px-3 py-2 rounded-lg border border-border bg-background focus:border-accent outline-none transition-colors text-sm resize-y ${className}`}
      {...props}
    />
  );
}

/**
 * Блок ошибки формы (поддерживает кнопку перехода к дубликату).
 */
export function FormError({
  error,
  existingId,
  href,
}: {
  error: string | null;
  existingId?: number | null;
  href?: string;
}) {
  if (!error) return null;
  return (
    <div className="text-sm text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-2 flex items-start justify-between gap-3">
      <span className="flex items-center gap-2 flex-1">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {error}
      </span>
      {existingId && href && (
        <a
          href={href}
          className="shrink-0 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors text-red-200 whitespace-nowrap"
        >
          Открыть её →
        </a>
      )}
    </div>
  );
}

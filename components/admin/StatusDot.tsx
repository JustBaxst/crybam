import { Tooltip } from "@/components/Tooltip";

type StatusItem = {
  label: string;
  isFilled: boolean;
  isCritical?: boolean; // Если true и не заполнено, точка будет красной
};

export function StatusDot({ items }: { items: StatusItem[] }) {
  const missing = items.filter((i) => !i.isFilled);
  const hasCriticalMissing = missing.some((i) => i.isCritical);

  if (missing.length === 0) {
    return (
      <Tooltip content="Все заполнено">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
      </Tooltip>
    );
  }

  return (
    <Tooltip content={`Не хватает: ${missing.map((m) => m.label).join(", ")}`}>
      <div
        className={`w-2.5 h-2.5 rounded-full ${hasCriticalMissing
            ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            : "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]"
          }`}
      />
    </Tooltip>
  );
}
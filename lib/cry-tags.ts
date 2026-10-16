import { HeartCrack, Sparkles, Smile, type LucideIcon } from "lucide-react";

export const CRY_TAGS = {
  sad: {
    Icon: HeartCrack,
    label: "Рыдай",
    description: "Грустная, тяжёлая, стоит подготовиться",
  },
  bittersweet: {
    Icon: Sparkles,
    label: "Слёзы счастья",
    description: "Тёплая, трогательная, счастливые слёзы",
  },
  safe: {
    Icon: Smile,
    label: "Безопасно",
    description: "Лёгкая, без эмоциональных потрясений",
  },
} as const satisfies Record<string, { Icon: LucideIcon; label: string; description: string }>;

export type CryTag = keyof typeof CRY_TAGS;

export function isCryTag(value: unknown): value is CryTag {
  return typeof value === "string" && value in CRY_TAGS;
}

export function cryTagLabel(tag: string | null | undefined): string {
  if (!tag || !isCryTag(tag)) return "";
  return CRY_TAGS[tag].label;
}
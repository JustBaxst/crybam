import { HeartCrack, Sparkles, Smile, type LucideIcon } from "lucide-react";

export const CRY_TAGS = {
  sad: {
    Icon: HeartCrack,
    label: "Рыдай",
    description: "Грустная, тяжёлая, стоит подготовиться",
    color: "text-cry-sad",
    bg: "bg-cry-sad",
    border: "border-cry-sad/30",
  },
  bittersweet: {
    Icon: Sparkles,
    label: "Слёзы счастья",
    description: "Тёплая, трогательная, счастливые слёзы",
    color: "text-cry-happy",
    bg: "bg-cry-happy",
    border: "border-cry-happy/30",
  },
  safe: {
    Icon: Smile,
    label: "Безопасно",
    description: "Лёгкая, без эмоциональных потрясений",
    color: "text-cry-safe",
    bg: "bg-cry-safe",
    border: "border-cry-safe/30",
  },
} as const satisfies Record<string, {
  Icon: LucideIcon;
  label: string;
  description: string;
  color: string;
  bg: string;
  border: string;
}>;

export type CryTag = keyof typeof CRY_TAGS;

export function isCryTag(value: unknown): value is CryTag {
  return typeof value === "string" && value in CRY_TAGS;
}

export function cryTagLabel(tag: string | null | undefined): string {
  if (!tag || !isCryTag(tag)) return "";
  return CRY_TAGS[tag].label;
}
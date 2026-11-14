import { User, Film, PenTool, Briefcase, Music, Camera, Scissors, Palette, Shirt, Mic, Sparkles, Shield, Users, Disc, HelpCircle } from "lucide-react";

export const CREDIT_ROLES = [
    { value: "actor", label: "Актёр", icon: User, color: "text-accent" },
    { value: "director", label: "Режиссёр", icon: Film, color: "text-blue-400" },
    { value: "writer", label: "Сценарист", icon: PenTool, color: "text-purple-400" },
    { value: "producer", label: "Продюсер", icon: Briefcase, color: "text-green-400" },
    { value: "composer", label: "Композитор", icon: Music, color: "text-yellow-400" },
    { value: "cinematographer", label: "Оператор", icon: Camera, color: "text-orange-400" },
    { value: "editor", label: "Монтажёр", icon: Scissors, color: "text-red-400" },
    { value: "production_designer", label: "Художник-постановщик", icon: Palette, color: "text-pink-400" },
    { value: "costume_designer", label: "Художник по костюмам", icon: Shirt, color: "text-teal-400" },
    { value: "sound_designer", label: "Звукорежиссёр", icon: Mic, color: "text-indigo-400" },
    { value: "vfx", label: "Специалист по VFX", icon: Sparkles, color: "text-cyan-400" },
    { value: "stunt_coordinator", label: "Постановщик трюков", icon: Shield, color: "text-rose-400" },
    { value: "casting_director", label: "Режиссёр по кастингу", icon: Users, color: "text-lime-400" },
    { value: "music_supervisor", label: "Музыкальный супервайзер", icon: Disc, color: "text-amber-400" },
    { value: "other", label: "Другое", icon: HelpCircle, color: "text-muted" },
] as const;

export type CreditRoleType = typeof CREDIT_ROLES[number]["value"];

export function getCreditRoleLabel(value: string): string {
    return CREDIT_ROLES.find(r => r.value === value)?.label || value;
}
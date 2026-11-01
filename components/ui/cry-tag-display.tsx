import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CryTagDisplayProps = {
    tag: CryTag;
    showIcon?: boolean;      // <-- Показывать иконку (по умолчанию true)
    showEmoji?: boolean;     // <-- Использовать эмодзи вместо иконки, если showIcon=false
    size?: "sm" | "md" | "lg"; // <-- Размер
    variant?: "badge" | "text"; // <-- Стиль (пилюля с фоном или просто текст)
};

export function CryTagDisplay({
    tag,
    showIcon = true,
    showEmoji = false,
    size = "md",
    variant = "badge",
}: CryTagDisplayProps) {
    const config = CRY_TAGS[tag];
    if (!config) return null;

    const Icon = config.Icon;

    // Размеры
    const sizeClasses = {
        sm: { text: "text-[10px]", icon: "w-3 h-3", padding: "px-2 py-0.5" },
        md: { text: "text-sm", icon: "w-4 h-4", padding: "px-3 py-1" },
        lg: { text: "text-base", icon: "w-5 h-5", padding: "px-4 py-1.5" },
    }[size];

    // Стили отображения
    const variantClasses =
        variant === "badge"
            ? `bg-surface border ${config.border} ${config.color} rounded-full font-medium`
            : config.color;

    // Логика вывода: эмодзи из label, или иконка, или просто текст
    const displayText = showEmoji ? config.label : config.plainLabel;

    return (
        <span className={`inline-flex items-center gap-1.5 leading-none ${sizeClasses.text} ${sizeClasses.padding} ${variantClasses}`}>
            {showIcon && <Icon className={`${sizeClasses.icon} shrink-0`} />}
            {displayText}
        </span>
    );
}
import { CRY_TAGS, type CryTag } from "@/lib/cry-tags";

type CryTagDisplayProps = {
    tag: CryTag;
    showIcon?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "badge" | "text";
};

export function CryTagDisplay({
    tag,
    showIcon = true,
    size = "md",
    variant = "badge",
}: CryTagDisplayProps) {
    const config = CRY_TAGS[tag];
    if (!config) return null;

    const Icon = config.Icon;

    const sizeClasses = {
        sm: { text: "text-[10px]", icon: "w-3 h-3", padding: "px-2 py-0.5" },
        md: { text: "text-sm", icon: "w-4 h-4", padding: "px-3 py-1" },
        lg: { text: "text-base", icon: "w-5 h-5", padding: "px-4 py-1.5" },
    }[size];

    const variantClasses =
        variant === "badge"
            ? `bg-surface border ${config.border} ${config.color} rounded-full font-medium`
            : config.color;

    return (
        <span className={`inline-flex items-center gap-1.5 leading-none ${sizeClasses.text} ${sizeClasses.padding} ${variantClasses}`}>
            {showIcon && <Icon className={`${sizeClasses.icon} shrink-0`} />}
            {config.label}
        </span>
    );
}
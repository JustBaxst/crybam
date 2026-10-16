import { CRY_TAGS, isCryTag, type CryTag } from "@/lib/cry-tags";

const styles: Record<CryTag, string> = {
  sad: "bg-cry-sad/15 text-cry-sad border-cry-sad/30",
  bittersweet: "bg-cry-happy/15 text-cry-happy border-cry-happy/30",
  safe: "bg-cry-safe/15 text-cry-safe border-cry-safe/30",
};

export function CryBadge({
  tag,
  size = "md",
  withLabel = true,
}: {
  tag: string | null | undefined;
  size?: "sm" | "md";
  withLabel?: boolean;
}) {
  if (!tag || !isCryTag(tag)) return null;

  const { Icon, label } = CRY_TAGS[tag];

  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-1 gap-1"
      : "text-sm px-3 py-1.5 gap-1.5";

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <span
      className={`inline-flex items-center ${sizeClass} rounded-full border font-medium ${styles[tag]}`}
      title={label}
    >
      <Icon className={`${iconSize} shrink-0`} />
      {withLabel && <span>{label}</span>}
    </span>
  );
}
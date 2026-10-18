import { LucideIcon } from "lucide-react";

type FormSectionProps = {
  Icon: LucideIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function FormSection({
  Icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-4 h-4 text-accent" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-xs text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
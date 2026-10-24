"use client";

import { SmartLink } from "./SmartLink";
import { ComingSoon } from "./ComingSoon";
import { LucideIcon } from "lucide-react";

type MenuLinkProps = {
  href: string;
  Icon: LucideIcon;
  label: string;
  hint?: string;
  isWip?: boolean;
  onClick?: () => void;
};

export function MenuLink({ href, Icon, label, hint, isWip, onClick }: MenuLinkProps) {
  return (
    <SmartLink
      href={href}
      isWip={isWip}
      onClick={onClick}
      className="flex items-start gap-3 px-4 py-3 hover:bg-foreground/5 transition-colors border-b border-border last:border-b-0"
    >
      <Icon className="w-5 h-5 mt-0.5 shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium flex items-center gap-1.5">
          {label}
          {/* Магия тут: если isWip=true, бейдж появится сам */}
          {isWip && <ComingSoon />}
        </div>
        {hint && <div className="text-xs text-muted mt-0.5">{hint}</div>}
      </div>
    </SmartLink>
  );
}
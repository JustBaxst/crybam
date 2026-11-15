"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ComponentProps } from "react";
import { Construction } from "lucide-react";

type SmartLinkProps = ComponentProps<typeof Link> & {
  isWip?: boolean;
  wipMessage?: string;
};

export function SmartLink({
  href,
  isWip,
  wipMessage,
  children,
  onClick,
  ...props
}: SmartLinkProps) {
  return (
    <Link
      href={isWip ? "#" : href}
      onClick={(e) => {
        if (isWip) {
          e.preventDefault();
          toast.info(wipMessage || "Этот раздел ещё в разработке", {
            icon: <Construction className="w-4 h-4" />,
          });
        }
        onClick?.(e); // Если передан свой onClick — вызываем его
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
"use client";

import Link from "next/link";
import { toast } from "sonner";
import { ComponentProps } from "react";

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
          toast.info(wipMessage || "Этот раздел ещё в разработке 🚧");
        }
        onClick?.(e); // Если передан свой onClick — вызываем его
      }}
      {...props}
    >
      {children}
    </Link>
  );
}
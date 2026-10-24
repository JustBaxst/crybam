"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function WipLink({ 
  children, 
  message = "Этот раздел ещё в разработке 🚧" 
}: { 
  children: React.ReactNode; 
  message?: string;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Отменяем переход
    toast.info(message);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer">
      {children}
    </div>
  );
}
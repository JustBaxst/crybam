import { Hammer } from "lucide-react";

export function ComingSoon({ text = "Скоро" }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-sm ml-2">
      <Hammer className="w-2.5 h-2.5" />
      {text}
    </span>
  );
}
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FavoriteActorButton() {
    return (
        <Button
            variant="outline"
            className="w-full h-10 gap-2 text-muted hover:text-foreground hover:border-accent/40 cursor-pointer"
        >
            <Plus className="w-4 h-4 shrink-0" />
            В избранное
        </Button>
    );
}
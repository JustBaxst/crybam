"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface SplitButtonProps {
    children: React.ReactNode;
    onMainClick?: () => void;
    menuContent: React.ReactNode;
    className?: string;
}

export function SplitButton({
    children,
    onMainClick,
    menuContent,
    className = "",
}: SplitButtonProps) {
    return (
        <div
            className={`group inline-flex items-center rounded-xl border border-accent/50 bg-surface overflow-hidden shadow-sm transition-all hover:border-accent ${className}`}
        >
            {/* Левая часть: Основное действие */}
            <Button
                variant="ghost"
                className="rounded-none border-none text-accent group-hover:bg-accent/10 h-10 px-4"
                onClick={onMainClick}
            >
                {children}
            </Button>

            {/* Разделитель */}
            <div className="w-px h-6 bg-accent/20 transition-colors group-hover:bg-accent/40" />

            {/* Правая часть: Выпадающее меню */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="rounded-none border-none text-accent group-hover:bg-accent/10 h-10 px-2"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    {menuContent}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
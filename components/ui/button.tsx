import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "default", size = "default", ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-accent text-white hover:opacity-90",
            outline: "border border-border bg-surface hover:bg-surface/80 text-foreground",
            ghost: "hover:bg-accent/10 hover:text-accent text-foreground",
            destructive: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-lg px-3 text-xs",
            lg: "h-12 rounded-xl px-8",
            icon: "h-10 w-10",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
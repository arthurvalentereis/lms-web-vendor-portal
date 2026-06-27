import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:
      "bg-[var(--letmesee-purple)] text-white hover:opacity-90 disabled:opacity-50",
    outline:
      "border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] hover:bg-[var(--letmesee-surface-subtle)]",
    ghost: "hover:bg-[var(--letmesee-surface-subtle)]",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-[var(--letmesee-foreground)] transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

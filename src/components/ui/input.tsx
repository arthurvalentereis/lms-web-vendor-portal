import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-[var(--letmesee-border)] bg-[var(--letmesee-input-bg)] px-3 py-2 text-sm text-[var(--letmesee-foreground)] outline-none placeholder:text-[var(--letmesee-muted)] focus-visible:border-[var(--letmesee-purple)] focus-visible:ring-2 focus-visible:ring-[var(--letmesee-purple)]/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

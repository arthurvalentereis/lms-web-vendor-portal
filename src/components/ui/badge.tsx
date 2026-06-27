import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "success" | "warning" | "destructive";
}) {
  const variants = {
    default:
      "bg-[var(--letmesee-surface-subtle)] text-[var(--letmesee-foreground)]",
    success: "bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300",
    warning: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
    destructive: "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

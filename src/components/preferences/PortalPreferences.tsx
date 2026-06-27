import { LanguageMenu } from "@/components/preferences/LanguageMenu";
import { ThemeMenu } from "@/components/preferences/ThemeMenu";
import { cn } from "@/lib/utils";

interface PortalPreferencesProps {
  variant?: "sidebar" | "floating";
}

export function PortalPreferences({ variant = "sidebar" }: PortalPreferencesProps) {
  const menuPlacement = variant === "floating" ? "below" : "above";
  const menuAlign = variant === "floating" ? "right" : "left";

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        variant === "floating" &&
          [
            "fixed z-50",
            "left-0 right-0 top-0 justify-end gap-0.5",
            "border-b border-[var(--letmesee-border)] bg-[var(--letmesee-surface)]/95 px-3 pb-2",
            "pt-[max(0.5rem,env(safe-area-inset-top))]",
            "backdrop-blur-md",
            "sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:top-[max(1rem,env(safe-area-inset-top))]",
            "sm:w-auto sm:rounded-xl sm:border sm:p-1 sm:shadow-sm",
          ],
        variant === "sidebar" && "justify-end px-1"
      )}
    >
      <ThemeMenu menuPlacement={menuPlacement} menuAlign={menuAlign} />
      <LanguageMenu menuPlacement={menuPlacement} menuAlign={menuAlign} />
    </div>
  );
}

import { useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface PreferenceMenuOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface PreferenceMenuProps<T extends string> {
  ariaLabel: string;
  value: T;
  options: PreferenceMenuOption<T>[];
  onChange: (value: T) => void;
  trigger: ReactNode;
  align?: "left" | "right";
  placement?: "above" | "below";
}

export function PreferenceMenu<T extends string>({
  ariaLabel,
  value,
  options,
  onChange,
  trigger,
  align = "left",
  placement = "below",
}: PreferenceMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface)] hover:text-[var(--letmesee-foreground)]"
      >
        {trigger}
      </button>

      {open ? (
        <div
          role="menu"
          className={cn(
            "absolute z-50 min-w-[10.5rem] rounded-lg border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-1 shadow-lg",
            placement === "above" ? "bottom-full mb-1.5" : "top-full mt-1.5",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]"
                    : "text-[var(--letmesee-foreground)] hover:bg-[var(--letmesee-surface-subtle)]"
                )}
              >
                {option.icon ? (
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center opacity-80">
                    {option.icon}
                  </span>
                ) : null}
                <span className="flex-1">{option.label}</span>
                {isActive ? <Check className="h-3.5 w-3.5 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

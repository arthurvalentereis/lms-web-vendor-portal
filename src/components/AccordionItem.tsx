import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  leading?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionItem({
  title,
  description,
  meta,
  leading,
  defaultOpen = false,
  children,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition hover:bg-[var(--letmesee-purple)]/5"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {leading}
          <div className="min-w-0">
            <div className="font-semibold text-[var(--letmesee-foreground)]">{title}</div>
            {description ? (
              <div className="mt-0.5 text-xs text-[var(--letmesee-muted)]">{description}</div>
            ) : null}
            {meta ? (
              <div className="mt-1 text-sm text-[var(--letmesee-muted)]">{meta}</div>
            ) : null}
          </div>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[var(--letmesee-purple)] transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open ? <div className="border-t border-[var(--letmesee-border)] p-3">{children}</div> : null}
    </div>
  );
}

import { CircleHelp } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";

interface DocumentHelpPopoverProps {
  className?: string;
}

export function DocumentHelpPopover({ className }: DocumentHelpPopoverProps) {
  const { t } = useTranslation("common");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={t("requestCredit.fields.documentHelpAria")}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface-subtle)] hover:text-[var(--letmesee-foreground)]"
      >
        <CircleHelp className="h-4 w-4" aria-hidden />
      </button>

      {open ? (
        <div
          role="tooltip"
          className="absolute left-1/2 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-3 text-xs leading-relaxed text-[var(--letmesee-muted)] shadow-lg sm:left-0 sm:translate-x-0"
        >
          <p className="font-medium text-[var(--letmesee-foreground)]">
            {t("requestCredit.fields.documentHelpTitle")}
          </p>
          <p className="mt-1">{t("requestCredit.fields.documentHelpBody")}</p>
        </div>
      ) : null}
    </div>
  );
}

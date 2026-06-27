import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRequestCreditModal } from "@/contexts/RequestCreditModalContext";
import { cn } from "@/lib/utils";

interface RequestCreditTriggerButtonProps {
  className?: string;
  showIcon?: boolean;
  labelKey?: "newRequest" | "newRequestShort";
}

export function RequestCreditTriggerButton({
  className,
  showIcon = true,
  labelKey = "newRequest",
}: RequestCreditTriggerButtonProps) {
  const { t } = useTranslation("dashboard");
  const { openRequestCredit } = useRequestCreditModal();

  const label =
    labelKey === "newRequestShort"
      ? t("analysisRequests.newRequestShort")
      : t("analysisRequests.newRequest");

  return (
    <button
      type="button"
      onClick={openRequestCredit}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-[var(--letmesee-purple)] px-3 py-2 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90",
        className
      )}
    >
      {showIcon ? <Plus className="h-4 w-4 shrink-0" aria-hidden /> : null}
      <span>{label}</span>
    </button>
  );
}

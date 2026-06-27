export type ApprovalStatusTone = "inAnalysis" | "approved" | "rejected";

export function getApprovalStatusTone(approved?: boolean | null): ApprovalStatusTone {
  if (approved === true) return "approved";
  if (approved === false) return "rejected";
  return "inAnalysis";
}

export const approvalStatusStyles: Record<
  ApprovalStatusTone,
  { icon: string; iconBg: string; badge: string }
> = {
  inAnalysis: {
    icon: "text-amber-500 dark:text-amber-400",
    iconBg: "bg-amber-500/10",
    badge: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
  approved: {
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/10",
    badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  },
  rejected: {
    icon: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-500/10",
    badge: "bg-red-500/15 text-red-700 dark:text-red-300",
  },
};

import {
  CheckCircle2,
  Clock,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { VendorPortalDashboardKpis } from "@/models";
import { approvalStatusStyles } from "@/lib/approvalStatusStyles";
import { cn } from "@/lib/utils";

interface DashboardKpiSidebarProps {
  kpis?: VendorPortalDashboardKpis;
  loading?: boolean;
  labels: {
    activeCustomers: string;
    totalRequests: string;
    inAnalysis: string;
    approved: string;
    rejected: string;
  };
}

function KpiRow({
  label,
  value,
  icon: Icon,
  iconClassName,
  iconBgClassName,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconClassName?: string;
  iconBgClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--letmesee-border)]/60 px-4 py-3 last:border-b-0">
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--letmesee-muted)]">
          {label}
        </p>
        <p className="mt-0.5 text-xl font-semibold tabular-nums text-[var(--letmesee-foreground)]">
          {value}
        </p>
      </div>
      <span
        className={cn(
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          iconBgClassName ?? "bg-[var(--letmesee-purple)]/8",
          iconClassName ?? "text-[var(--letmesee-purple)]"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="space-y-0 rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)]">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 border-b border-[var(--letmesee-border)]/60 px-4 py-3 last:border-b-0"
        >
          <div className="flex-1 space-y-2">
            <div className="h-2.5 w-20 animate-pulse rounded bg-[var(--letmesee-surface-subtle)]" />
            <div className="h-6 w-10 animate-pulse rounded bg-[var(--letmesee-surface-subtle)]" />
          </div>
          <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--letmesee-surface-subtle)]" />
        </div>
      ))}
    </div>
  );
}

export function DashboardKpiSidebar({ kpis, loading, labels }: DashboardKpiSidebarProps) {
  if (loading) {
    return (
      <>
        <div className="hidden lg:block">
          <KpiSkeleton />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)]"
            />
          ))}
        </div>
      </>
    );
  }

  const items = [
    { label: labels.activeCustomers, value: kpis?.activeCustomersCount ?? 0, icon: Users },
    { label: labels.totalRequests, value: kpis?.totalAnalysisRequests ?? 0, icon: Clock },
    {
      label: labels.inAnalysis,
      value: kpis?.inAnalysisCount ?? 0,
      icon: Clock,
      iconClassName: approvalStatusStyles.inAnalysis.icon,
      iconBgClassName: approvalStatusStyles.inAnalysis.iconBg,
    },
    {
      label: labels.approved,
      value: kpis?.approvedCount ?? 0,
      icon: CheckCircle2,
      iconClassName: approvalStatusStyles.approved.icon,
      iconBgClassName: approvalStatusStyles.approved.iconBg,
    },
    {
      label: labels.rejected,
      value: kpis?.rejectedCount ?? 0,
      icon: XCircle,
      iconClassName: approvalStatusStyles.rejected.icon,
      iconBgClassName: approvalStatusStyles.rejected.iconBg,
    },
  ];

  return (
    <>
      <div className="hidden overflow-hidden rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] shadow-sm lg:block">
        {items.map((item) => (
          <KpiRow key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:hidden">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] px-3 py-3 shadow-sm",
              item.label === labels.rejected ? "col-span-2" : undefined
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[var(--letmesee-muted)]">
                  {item.label}
                </p>
                <p className="mt-1 text-lg font-semibold tabular-nums text-[var(--letmesee-foreground)]">
                  {item.value}
                </p>
              </div>
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  item.iconClassName ?? "text-[var(--letmesee-purple)]"
                )}
                strokeWidth={1.75}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, Users, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/PageMeta";
import { CustomerListPreview } from "@/components/customers/CustomerList";
import { AnalysisRequestListPreview } from "@/components/analysis/AnalysisRequestList";
import type { VendorPortalDashboard } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

function KpiCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--letmesee-muted)]">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-[var(--letmesee-foreground)]">{value}</p>
        </div>
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const [dashboard, setDashboard] = useState<VendorPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorPortalService
      .getDashboard()
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, []);

  const kpis = dashboard?.kpis;

  return (
    <>
      <PageMeta
        title={t("common:seo.dashboardTitle")}
        description={t("common:seo.dashboardDescription")}
        path="/dashboard"
      />

      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-[var(--letmesee-foreground)] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--letmesee-muted)]">{t("subtitle")}</p>
        </header>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 animate-pulse rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label={t("kpis.activeCustomers")}
              value={kpis?.activeCustomersCount ?? 0}
              icon={Users}
            />
            <KpiCard
              label={t("kpis.totalRequests")}
              value={kpis?.totalAnalysisRequests ?? 0}
              icon={Clock}
            />
            <KpiCard
              label={t("kpis.inAnalysis")}
              value={kpis?.inAnalysisCount ?? 0}
              icon={Clock}
            />
            <KpiCard
              label={t("kpis.approved")}
              value={kpis?.approvedCount ?? 0}
              icon={CheckCircle2}
            />
            <KpiCard
              label={t("kpis.rejected")}
              value={kpis?.rejectedCount ?? 0}
              icon={XCircle}
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--letmesee-foreground)]">
                {t("recentCustomers.title")}
              </h2>
              <Link
                to="/customers"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--letmesee-purple)] hover:underline"
              >
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <CustomerListPreview
              items={dashboard?.recentCustomers ?? []}
              loading={loading}
              emptyMessage={t("recentCustomers.empty")}
            />
          </section>

          <section className="rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-[var(--letmesee-foreground)]">
                {t("recentRequests.title")}
              </h2>
              <Link
                to="/analysis-requests"
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--letmesee-purple)] hover:underline"
              >
                {t("viewAll")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <AnalysisRequestListPreview
              items={dashboard?.recentAnalysisRequests ?? []}
              loading={loading}
              emptyMessage={t("recentRequests.empty")}
            />
          </section>
        </div>
      </div>
    </>
  );
}

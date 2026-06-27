import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/PageMeta";
import { usePortalPageMeta } from "@/hooks/usePortalPageMeta";
import { CustomerListPreview } from "@/components/customers/CustomerList";
import { AnalysisRequestListPreview } from "@/components/analysis/AnalysisRequestList";
import { DashboardKpiSidebar } from "@/components/dashboard/DashboardKpiSidebar";
import { DashboardOrdersChartPanel } from "@/components/dashboard/DashboardOrdersChartPanel";
import type { VendorPortalDashboard } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

export function DashboardPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { siteName, buildTitle } = usePortalPageMeta();
  const [dashboard, setDashboard] = useState<VendorPortalDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vendorPortalService
      .getDashboard()
      .then(setDashboard)
      .finally(() => setLoading(false));
  }, []);

  const kpiLabels = {
    activeCustomers: t("kpis.activeCustomers"),
    totalRequests: t("kpis.totalRequests"),
    inAnalysis: t("kpis.inAnalysis"),
    approved: t("kpis.approved"),
    rejected: t("kpis.rejected"),
  };

  return (
    <>
      <PageMeta
        title={buildTitle(t("common:seo.dashboardTitle"))}
        description={t("common:seo.dashboardDescription")}
        path="/dashboard"
        siteName={siteName}
      />

      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold text-[var(--letmesee-foreground)] sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--letmesee-muted)]">{t("subtitle")}</p>
        </header>

        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <div className="lg:col-span-1">
            <DashboardKpiSidebar
              kpis={dashboard?.kpis}
              loading={loading}
              labels={kpiLabels}
            />
          </div>
          <div className="lg:col-span-2">
            <DashboardOrdersChartPanel
              monthlyOrders={dashboard?.monthlyOrders ?? []}
              loading={loading}
            />
          </div>
        </div>

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

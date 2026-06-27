import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/PageMeta";
import { AnalysisRequestList } from "@/components/analysis/AnalysisRequestList";
import type { VendorPortalAnalysisRequest } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

export function AnalysisRequestsPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const [items, setItems] = useState<VendorPortalAnalysisRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    vendorPortalService
      .getAnalysisRequests(page, pageSize)
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
      })
      .finally(() => setLoading(false));
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <PageMeta
        title={t("common:seo.analysisRequestsTitle")}
        description={t("common:seo.analysisRequestsDescription")}
        path="/analysis-requests"
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--letmesee-foreground)] sm:text-3xl">
            {t("analysisRequests.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--letmesee-muted)]">
            {t("analysisRequests.subtitle")}
          </p>
        </header>

        <AnalysisRequestList
          items={items}
          loading={loading}
          emptyMessage={t("analysisRequests.empty")}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}

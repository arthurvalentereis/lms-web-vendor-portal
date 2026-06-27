import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/PageMeta";
import { RequestCreditTriggerButton } from "@/components/RequestCreditTriggerButton";
import { AnalysisRequestList } from "@/components/analysis/AnalysisRequestList";
import { useRequestCreditModal } from "@/contexts/RequestCreditModalContext";
import { usePortalPageMeta } from "@/hooks/usePortalPageMeta";
import type { VendorPortalAnalysisRequest } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

export function AnalysisRequestsPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { requestCreatedVersion } = useRequestCreditModal();
  const { siteName, buildTitle } = usePortalPageMeta();
  const [items, setItems] = useState<VendorPortalAnalysisRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    if (requestCreatedVersion > 0) {
      setPage(1);
    }
  }, [requestCreatedVersion]);

  useEffect(() => {
    setLoading(true);
    vendorPortalService
      .getAnalysisRequests(page, pageSize)
      .then((result) => {
        setItems(result.items);
        setTotal(result.total);
      })
      .finally(() => setLoading(false));
  }, [page, requestCreatedVersion]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <PageMeta
        title={buildTitle(t("common:seo.analysisRequestsTitle"))}
        description={t("common:seo.analysisRequestsDescription")}
        path="/analysis-requests"
        siteName={siteName}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--letmesee-foreground)] sm:text-3xl">
              {t("analysisRequests.title")}
            </h1>
            <p className="mt-1 text-sm text-[var(--letmesee-muted)]">
              {t("analysisRequests.subtitle")}
            </p>
          </div>
          <RequestCreditTriggerButton className="shrink-0 self-start" />
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

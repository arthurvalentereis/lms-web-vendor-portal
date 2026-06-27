import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PageMeta } from "@/components/PageMeta";
import { usePortalPageMeta } from "@/hooks/usePortalPageMeta";
import { CustomerList } from "@/components/customers/CustomerList";
import type { VendorPortalCustomer } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

export function CustomersPage() {
  const { t } = useTranslation(["dashboard", "common"]);
  const { siteName, buildTitle } = usePortalPageMeta();
  const [items, setItems] = useState<VendorPortalCustomer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    vendorPortalService
      .getCustomers(page, pageSize)
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
        title={buildTitle(t("common:seo.customersTitle"))}
        description={t("common:seo.customersDescription")}
        path="/customers"
        siteName={siteName}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[var(--letmesee-foreground)] sm:text-3xl">
            {t("customers.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--letmesee-muted)]">{t("customers.subtitle")}</p>
        </header>

        <CustomerList
          items={items}
          loading={loading}
          emptyMessage={t("customers.empty")}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}

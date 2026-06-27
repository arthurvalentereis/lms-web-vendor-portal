import { useTranslation } from "react-i18next";
import type { VendorPortalCustomer } from "@/models";
import { formatDocument } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

function CustomerTypeBadge({ type }: { type: "Pf" | "Pj" }) {
  const { t } = useTranslation("common");
  return (
    <Badge variant="default">
      {type === "Pf" ? t("customerType.pf") : t("customerType.pj")}
    </Badge>
  );
}

function CustomerCard({
  customer,
  showCreditor = false,
}: {
  customer: VendorPortalCustomer;
  showCreditor?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[var(--letmesee-foreground)]">{customer.name}</p>
          <p className="mt-1 text-xs text-[var(--letmesee-muted)]">
            {formatDocument(customer.document)}
          </p>
        </div>
        <CustomerTypeBadge type={customer.customerType} />
      </div>
      {showCreditor && customer.creditorName ? (
        <p className="mt-3 text-xs text-[var(--letmesee-muted)]">{customer.creditorName}</p>
      ) : null}
    </article>
  );
}

function CustomerPreviewSkeleton({ variant }: { variant: "card" | "row" }) {
  if (variant === "card") {
    return (
      <div className="h-[5.5rem] animate-pulse rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)]" />
    );
  }

  return (
    <div className="h-14 animate-pulse rounded-xl bg-[var(--letmesee-surface-subtle)]" />
  );
}

export function CustomerListPreview({
  items,
  loading,
  emptyMessage,
}: {
  items: VendorPortalCustomer[];
  loading?: boolean;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <>
        <div className="grid gap-3 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <CustomerPreviewSkeleton key={index} variant="card" />
          ))}
        </div>
        <div className="hidden space-y-3 md:block">
          {Array.from({ length: 3 }).map((_, index) => (
            <CustomerPreviewSkeleton key={index} variant="row" />
          ))}
        </div>
      </>
    );
  }

  if (!items.length) {
    return <p className="text-sm text-[var(--letmesee-muted)]">{emptyMessage}</p>;
  }

  return (
    <>
      <ul className="hidden divide-y divide-[var(--letmesee-border)] md:block">
        {items.map((customer) => (
          <li
            key={`${customer.customerType}-${customer.id}`}
            className="flex items-center justify-between gap-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--letmesee-foreground)]">
                {customer.name}
              </p>
              <p className="truncate text-xs text-[var(--letmesee-muted)]">
                {formatDocument(customer.document)}
              </p>
            </div>
            <CustomerTypeBadge type={customer.customerType} />
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:hidden">
        {items.map((customer) => (
          <CustomerCard key={`${customer.customerType}-${customer.id}`} customer={customer} />
        ))}
      </div>
    </>
  );
}

export function CustomerList({
  items,
  loading,
  emptyMessage,
  page,
  totalPages,
  onPageChange,
}: {
  items: VendorPortalCustomer[];
  loading?: boolean;
  emptyMessage: string;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const { t } = useTranslation(["dashboard", "common"]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="h-16 animate-pulse rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)]"
          />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-10 text-center text-sm text-[var(--letmesee-muted)]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden overflow-hidden rounded-2xl border border-[var(--letmesee-border)] md:block">
        <table className="w-full text-sm">
          <thead className="bg-[var(--letmesee-surface-subtle)] text-left text-xs uppercase tracking-wide text-[var(--letmesee-muted)]">
            <tr>
              <th className="px-4 py-3">{t("customers.columns.name")}</th>
              <th className="px-4 py-3">{t("customers.columns.document")}</th>
              <th className="px-4 py-3">{t("customers.columns.type")}</th>
              <th className="px-4 py-3">{t("customers.columns.creditor")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((customer) => (
              <tr
                key={`${customer.customerType}-${customer.id}`}
                className="border-t border-[var(--letmesee-border)]"
              >
                <td className="px-4 py-3 font-medium text-[var(--letmesee-foreground)]">
                  {customer.name}
                </td>
                <td className="px-4 py-3 text-[var(--letmesee-muted)]">
                  {formatDocument(customer.document)}
                </td>
                <td className="px-4 py-3">
                  <CustomerTypeBadge type={customer.customerType} />
                </td>
                <td className="px-4 py-3 text-[var(--letmesee-muted)]">
                  {customer.creditorName ?? t("common:empty")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((customer) => (
          <CustomerCard key={`${customer.customerType}-${customer.id}`} customer={customer} showCreditor />
        ))}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[var(--letmesee-border)] px-3 py-2 text-sm disabled:opacity-50"
          >
            {t("common:previousPage")}
          </button>
          <span className="text-sm text-[var(--letmesee-muted)]">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[var(--letmesee-border)] px-3 py-2 text-sm disabled:opacity-50"
          >
            {t("common:nextPage")}
          </button>
        </div>
      ) : null}
    </div>
  );
}

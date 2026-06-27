import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { VendorPortalAnalysisRequest } from "@/models";
import { formatCurrency, formatDocument } from "@/lib/formatters";
import {
  approvalStatusStyles,
  getApprovalStatusTone,
} from "@/lib/approvalStatusStyles";
import { Badge } from "@/components/ui/badge";

function ApprovalBadge({ approved }: { approved?: boolean | null }) {
  const { t } = useTranslation("dashboard");
  const tone = getApprovalStatusTone(approved);
  const label =
    tone === "approved"
      ? t("status.approved")
      : tone === "rejected"
        ? t("status.rejected")
        : t("status.inAnalysis");

  return (
    <Badge className={approvalStatusStyles[tone].badge} variant="default">
      {label}
    </Badge>
  );
}

function AnalysisRequestCard({ request }: { request: VendorPortalAnalysisRequest }) {
  return (
    <article className="rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-[var(--letmesee-foreground)]">
            {request.customerName ?? request.customerDocument ?? `#${request.id}`}
          </p>
          {request.customerDocument && request.customerName ? (
            <p className="mt-1 text-xs text-[var(--letmesee-muted)]">
              {formatDocument(request.customerDocument)}
            </p>
          ) : null}
        </div>
        <ApprovalBadge approved={request.approved} />
      </div>
      <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-[var(--letmesee-muted)]">
        <span>{dayjs(request.requestedDate).format("DD/MM/YYYY")}</span>
        <span aria-hidden>·</span>
        <span>{formatCurrency(request.requestedAmount)}</span>
        {request.categoryName ? (
          <>
            <span aria-hidden>·</span>
            <span>{request.categoryName}</span>
          </>
        ) : null}
        {request.statusName ? (
          <>
            <span aria-hidden>·</span>
            <span>{request.statusName}</span>
          </>
        ) : null}
      </div>
    </article>
  );
}

function AnalysisRequestPreviewSkeleton({ variant }: { variant: "card" | "row" }) {
  if (variant === "card") {
    return (
      <div className="h-[5.5rem] animate-pulse rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)]" />
    );
  }

  return (
    <div className="h-14 animate-pulse rounded-xl bg-[var(--letmesee-surface-subtle)]" />
  );
}

export function AnalysisRequestListPreview({
  items,
  loading,
  emptyMessage,
}: {
  items: VendorPortalAnalysisRequest[];
  loading?: boolean;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <>
        <div className="grid gap-3 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <AnalysisRequestPreviewSkeleton key={index} variant="card" />
          ))}
        </div>
        <div className="hidden space-y-3 md:block">
          {Array.from({ length: 3 }).map((_, index) => (
            <AnalysisRequestPreviewSkeleton key={index} variant="row" />
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
        {items.map((request) => (
          <li key={request.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[var(--letmesee-foreground)]">
                {request.customerName ?? request.customerDocument ?? `#${request.id}`}
              </p>
              <p className="truncate text-xs text-[var(--letmesee-muted)]">
                {formatCurrency(request.requestedAmount)} ·{" "}
                {dayjs(request.requestedDate).format("DD/MM/YYYY")}
              </p>
            </div>
            <ApprovalBadge approved={request.approved} />
          </li>
        ))}
      </ul>

      <div className="grid gap-3 md:hidden">
        {items.map((request) => (
          <AnalysisRequestCard key={request.id} request={request} />
        ))}
      </div>
    </>
  );
}

export function AnalysisRequestList({
  items,
  loading,
  emptyMessage,
  page,
  totalPages,
  onPageChange,
}: {
  items: VendorPortalAnalysisRequest[];
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
              <th className="px-4 py-3">{t("analysisRequests.columns.date")}</th>
              <th className="px-4 py-3">{t("analysisRequests.columns.customer")}</th>
              <th className="px-4 py-3">{t("analysisRequests.columns.amount")}</th>
              <th className="px-4 py-3">{t("analysisRequests.columns.status")}</th>
              <th className="px-4 py-3">{t("analysisRequests.columns.category")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((request) => (
              <tr key={request.id} className="border-t border-[var(--letmesee-border)]">
                <td className="px-4 py-3 text-[var(--letmesee-muted)]">
                  {dayjs(request.requestedDate).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[var(--letmesee-foreground)]">
                    {request.customerName ?? t("common:empty")}
                  </p>
                  {request.customerDocument ? (
                    <p className="text-xs text-[var(--letmesee-muted)]">
                      {formatDocument(request.customerDocument)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[var(--letmesee-foreground)]">
                  {formatCurrency(request.requestedAmount)}
                </td>
                <td className="px-4 py-3">
                  <ApprovalBadge approved={request.approved} />
                  {request.statusName ? (
                    <p className="mt-1 text-xs text-[var(--letmesee-muted)]">{request.statusName}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[var(--letmesee-muted)]">
                  {request.categoryName ?? t("common:empty")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((request) => (
          <AnalysisRequestCard key={request.id} request={request} />
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

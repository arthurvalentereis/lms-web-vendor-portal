import {
  Building2,
  ClipboardList,
  Loader2,
  Search,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { VendorPortalAnalysisRequest, VendorPortalCustomer } from "@/models";
import { formatCurrency, formatDate, formatDocument } from "@/lib/formatters";
import {
  approvalStatusStyles,
  getApprovalStatusTone,
} from "@/lib/approvalStatusStyles";
import { cn } from "@/lib/utils";
import {
  useVendorQuickSearch,
  type VendorQuickSearchResults,
} from "./useVendorQuickSearch";

type QuickSearchEntry =
  | { kind: "customer"; item: VendorPortalCustomer }
  | { kind: "analysisRequest"; item: VendorPortalAnalysisRequest };

export type VendorQuickSearchController = ReturnType<typeof useVendorQuickSearch>;

function useIsMac() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform));
  }, []);

  return isMac;
}

function requestStatusLabel(
  approved: boolean | null | undefined,
  statusName: string | null | undefined,
  labels: { approved: string; rejected: string; inAnalysis: string }
) {
  if (statusName) return statusName;
  if (approved === true) return labels.approved;
  if (approved === false) return labels.rejected;
  return labels.inAnalysis;
}

export function VendorQuickSearchTrigger({
  openSearch,
}: Pick<VendorQuickSearchController, "openSearch">) {
  const { t } = useTranslation("common");
  const isMac = useIsMac();

  return (
    <button
      type="button"
      onClick={openSearch}
      className="inline-flex items-center gap-2 rounded-full border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] px-3 py-2 text-sm text-[var(--letmesee-muted)] shadow-sm transition-colors hover:border-[var(--letmesee-purple)]/30 hover:bg-[var(--letmesee-purple)]/5 hover:text-[var(--letmesee-foreground)]"
    >
      <Search className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
      <span className="hidden sm:inline">{t("quickSearch.trigger")}</span>
      <span className="sm:hidden">{t("quickSearch.triggerShort")}</span>
      <kbd className="hidden rounded border border-[var(--letmesee-border)] bg-[var(--letmesee-surface-subtle)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--letmesee-muted)] md:inline-block">
        {isMac ? "⌘ K" : "Ctrl K"}
      </kbd>
    </button>
  );
}

export function VendorQuickSearchDialog({
  open,
  close,
  query,
  setQuery,
  results,
  loading,
  hasSearched,
  hasResults,
  minQueryLength,
}: Pick<
  VendorQuickSearchController,
  | "open"
  | "close"
  | "query"
  | "setQuery"
  | "results"
  | "loading"
  | "hasSearched"
  | "hasResults"
  | "minQueryLength"
>) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const pfCustomers = results.customers.filter((item) => item.customerType === "Pf");
  const pjCustomers = results.customers.filter((item) => item.customerType === "Pj");

  const flatEntries = useMemo<QuickSearchEntry[]>(() => {
    const entries: QuickSearchEntry[] = [];
    for (const item of pjCustomers) entries.push({ kind: "customer", item });
    for (const item of pfCustomers) entries.push({ kind: "customer", item });
    for (const item of results.analysisRequests) {
      entries.push({ kind: "analysisRequest", item });
    }
    return entries;
  }, [pfCustomers, pjCustomers, results.analysisRequests]);

  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }
    setActiveIndex(-1);
    return undefined;
  }, [open]);

  useEffect(() => {
    setActiveIndex(flatEntries.length > 0 ? 0 : -1);
  }, [flatEntries]);

  const handleSelect = useCallback(
    (entry: QuickSearchEntry) => {
      close();
      navigate(entry.kind === "customer" ? "/customers" : "/analysis-requests");
    },
    [close, navigate]
  );

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flatEntries.length === 0) return;
      setActiveIndex((current) => (current + 1) % flatEntries.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flatEntries.length === 0) return;
      setActiveIndex((current) =>
        current <= 0 ? flatEntries.length - 1 : current - 1
      );
      return;
    }

    if (event.key === "Enter" && activeIndex >= 0 && flatEntries[activeIndex]) {
      event.preventDefault();
      handleSelect(flatEntries[activeIndex]);
    }
  };

  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const activeElement = listRef.current.querySelector<HTMLElement>(
      `[data-quick-search-index="${activeIndex}"]`
    );
    activeElement?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  const statusLabels = {
    approved: t("quickSearch.statusApproved"),
    rejected: t("quickSearch.statusRejected"),
    inAnalysis: t("quickSearch.statusInAnalysis"),
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[min(12vh,6rem)] sm:items-center sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t("quickSearch.close")}
        onClick={close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vendor-quick-search-title"
        className={cn(
          "relative flex max-h-[min(530px,85vh)] w-[min(740px,92vw)] flex-col overflow-hidden",
          "rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] shadow-2xl",
          "animate-in fade-in zoom-in-95 duration-200"
        )}
      >
        <h2 id="vendor-quick-search-title" className="sr-only">
          {t("quickSearch.title")}
        </h2>

        <div className="flex items-center gap-2 border-b border-[var(--letmesee-border)] px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-[var(--letmesee-purple)]" aria-hidden />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder={t("quickSearch.placeholder")}
            className="min-w-0 flex-1 bg-transparent text-base text-[var(--letmesee-foreground)] outline-none placeholder:text-[var(--letmesee-muted)]"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {loading ? (
            <Loader2
              className="h-4 w-4 shrink-0 animate-spin text-[var(--letmesee-muted)]"
              aria-hidden
            />
          ) : null}
          <button
            type="button"
            onClick={close}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface-subtle)] hover:text-[var(--letmesee-foreground)]"
            aria-label={t("quickSearch.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <SearchResults
          listRef={listRef}
          hasSearched={hasSearched}
          hasResults={hasResults}
          loading={loading}
          query={query}
          minQueryLength={minQueryLength}
          pfCustomers={pfCustomers}
          pjCustomers={pjCustomers}
          analysisRequests={results.analysisRequests}
          flatEntries={flatEntries}
          activeIndex={activeIndex}
          statusLabels={statusLabels}
          onSelect={handleSelect}
        />

        <div className="border-t border-[var(--letmesee-border)] px-4 py-2 text-[11px] text-[var(--letmesee-muted)]">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <span>{t("quickSearch.footerNavigate")}</span>
            <span>{t("quickSearch.footerOpen")}</span>
            <span>{t("quickSearch.footerClose")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResults({
  listRef,
  hasSearched,
  hasResults,
  loading,
  query,
  minQueryLength,
  pfCustomers,
  pjCustomers,
  analysisRequests,
  flatEntries,
  activeIndex,
  statusLabels,
  onSelect,
}: {
  listRef: React.RefObject<HTMLDivElement | null>;
  hasSearched: boolean;
  hasResults: boolean;
  loading: boolean;
  query: string;
  minQueryLength: number;
  pfCustomers: VendorPortalCustomer[];
  pjCustomers: VendorPortalCustomer[];
  analysisRequests: VendorPortalAnalysisRequest[];
  flatEntries: QuickSearchEntry[];
  activeIndex: number;
  statusLabels: { approved: string; rejected: string; inAnalysis: string };
  onSelect: (entry: QuickSearchEntry) => void;
}) {
  const { t } = useTranslation("common");

  return (
    <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
      {!hasSearched ? (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center text-[var(--letmesee-muted)]">
          <Search className="mb-3 h-8 w-8 opacity-30" aria-hidden />
          <p className="text-sm">{t("quickSearch.hint", { count: minQueryLength })}</p>
          <p className="mt-1 text-xs opacity-80">{t("quickSearch.hintDetail")}</p>
        </div>
      ) : null}

      {hasSearched && !loading && !hasResults ? (
        <p className="px-4 py-12 text-center text-sm text-[var(--letmesee-muted)]">
          {t("quickSearch.empty", { query: query.trim() })}
        </p>
      ) : null}

      {hasSearched && hasResults ? (
        <div className="space-y-3 pb-2">
          {pjCustomers.length > 0 ? (
            <CustomerGroup
              title={t("quickSearch.groupCustomersPj")}
              customers={pjCustomers}
              customerType="Pj"
              flatEntries={flatEntries}
              activeIndex={activeIndex}
              onSelect={onSelect}
              icon={Building2}
              badge="PJ"
              badgeClassName="bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]"
            />
          ) : null}

          {pfCustomers.length > 0 ? (
            <CustomerGroup
              title={t("quickSearch.groupCustomersPf")}
              customers={pfCustomers}
              customerType="Pf"
              flatEntries={flatEntries}
              activeIndex={activeIndex}
              onSelect={onSelect}
              icon={User}
              badge="PF"
              badgeClassName="bg-violet-500/10 text-violet-600 dark:text-violet-300"
            />
          ) : null}

          {analysisRequests.length > 0 ? (
            <section>
              <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--letmesee-muted)]">
                {t("quickSearch.groupOrders")}
              </p>
              <ul className="space-y-1">
                {analysisRequests.map((item) => {
                  const index = flatEntries.findIndex(
                    (entry) =>
                      entry.kind === "analysisRequest" && entry.item.id === item.id
                  );
                  const statusTone = getApprovalStatusTone(item.approved);
                  const statusStyle = approvalStatusStyles[statusTone];

                  return (
                    <li key={`request-${item.id}`}>
                      <button
                        type="button"
                        data-quick-search-index={index}
                        onClick={() => onSelect({ kind: "analysisRequest", item })}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                          activeIndex === index
                            ? "border-[var(--letmesee-purple)]/30 bg-[var(--letmesee-purple)]/10"
                            : "border-transparent hover:bg-[var(--letmesee-surface-subtle)]"
                        )}
                      >
                        <ClipboardList className={cn("h-4 w-4 shrink-0", statusStyle.icon)} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[var(--letmesee-foreground)]">
                            {item.customerName ||
                              t("quickSearch.orderFallback", { id: item.id })}
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--letmesee-muted)]">
                            {formatCurrency(item.requestedAmount)} ·{" "}
                            {formatDate(item.requestedDate)}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                            statusStyle.badge
                          )}
                        >
                          {requestStatusLabel(item.approved, item.statusName, statusLabels)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CustomerGroup({
  title,
  customers,
  customerType,
  flatEntries,
  activeIndex,
  onSelect,
  icon: Icon,
  badge,
  badgeClassName,
}: {
  title: string;
  customers: VendorPortalCustomer[];
  customerType: "Pf" | "Pj";
  flatEntries: QuickSearchEntry[];
  activeIndex: number;
  onSelect: (entry: QuickSearchEntry) => void;
  icon: typeof Building2;
  badge: string;
  badgeClassName: string;
}) {
  return (
    <section>
      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--letmesee-muted)]">
        {title}
      </p>
      <ul className="space-y-1">
        {customers.map((item) => {
          const index = flatEntries.findIndex(
            (entry) =>
              entry.kind === "customer" &&
              entry.item.id === item.id &&
              entry.item.customerType === customerType
          );

          return (
            <li key={`${customerType}-${item.id}`}>
              <button
                type="button"
                data-quick-search-index={index}
                onClick={() => onSelect({ kind: "customer", item })}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition",
                  activeIndex === index
                    ? "border-[var(--letmesee-purple)]/30 bg-[var(--letmesee-purple)]/10"
                    : "border-transparent hover:bg-[var(--letmesee-surface-subtle)]"
                )}
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--letmesee-purple)]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--letmesee-foreground)]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--letmesee-muted)]">
                    {formatDocument(item.document)}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    badgeClassName
                  )}
                >
                  {badge}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export { useVendorQuickSearch };
export type { VendorQuickSearchResults };

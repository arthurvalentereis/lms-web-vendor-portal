import { useCallback, useEffect, useRef, useState } from "react";
import type { VendorPortalAnalysisRequest, VendorPortalCustomer } from "@/models";
import { vendorPortalService } from "@/services/vendorPortalService";

const DEBOUNCE_MS = 300;
export const VENDOR_QUICK_SEARCH_MIN_QUERY_LENGTH = 2;

export interface VendorQuickSearchResults {
  customers: VendorPortalCustomer[];
  analysisRequests: VendorPortalAnalysisRequest[];
}

export function useVendorQuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VendorQuickSearchResults>({
    customers: [],
    analysisRequests: [],
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const resetSearch = useCallback(() => {
    setQuery("");
    setResults({ customers: [], analysisRequests: [] });
    setLoading(false);
    setHasSearched(false);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    resetSearch();
  }, [resetSearch]);

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => {
          if (current) {
            resetSearch();
            return false;
          }
          return true;
        });
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open, resetSearch]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < VENDOR_QUICK_SEARCH_MIN_QUERY_LENGTH) {
      setResults({ customers: [], analysisRequests: [] });
      setLoading(false);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    const requestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await vendorPortalService.quickSearch(trimmed, 20);
        if (requestId !== requestIdRef.current) return;
        setResults(response);
      } catch {
        if (requestId === requestIdRef.current) {
          setResults({ customers: [], analysisRequests: [] });
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [open, query]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const hasResults = results.customers.length > 0 || results.analysisRequests.length > 0;

  return {
    open,
    openSearch,
    close,
    query,
    setQuery,
    results,
    loading,
    hasSearched,
    hasResults,
    minQueryLength: VENDOR_QUICK_SEARCH_MIN_QUERY_LENGTH,
  };
}

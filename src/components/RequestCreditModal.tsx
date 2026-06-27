import { Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { DocumentHelpPopover } from "@/components/DocumentHelpPopover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { maskCurrencyInput, parseCurrencyInput } from "@/lib/cnpj";
import {
  detectDocumentKind,
  getDocumentDigitLength,
  isCompleteDocument,
  isCpfDocument,
  maskDocumentInput,
  normalizeDocumentForApi,
  shouldResolveDocument,
  validateDocument,
} from "@/lib/document";
import type { VendorPortalCompanyResolveSource } from "@/models";
import { cn } from "@/lib/utils";
import { vendorPortalService } from "@/services/vendorPortalService";

interface RequestCreditModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const RESOLVE_DEBOUNCE_MS = 400;

export function RequestCreditModal({ open, onClose, onCreated }: RequestCreditModalProps) {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const [documentValue, setDocumentValue] = useState("");
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<VendorPortalCompanyResolveSource>("manual");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setDocumentValue("");
    setDocumentError(null);
    setName("");
    setAmount("");
    setSource("manual");
    setLookupLoading(false);
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!isCompleteDocument(documentValue)) {
      setLookupLoading(false);
      if (
        detectDocumentKind(documentValue) === "empty" ||
        detectDocumentKind(documentValue) === "incomplete"
      ) {
        setDocumentError(null);
        setSource("manual");
      }
      return;
    }

    const validation = validateDocument(documentValue);
    if (!validation.valid) {
      setDocumentError(t(`requestCredit.errors.${validation.errorKey}`));
      setLookupLoading(false);
      if (validation.kind !== "cnpj") {
        setSource("manual");
      }
      return;
    }

    setDocumentError(null);

    if (!shouldResolveDocument(documentValue)) {
      setLookupLoading(false);
      setSource("manual");
      return;
    }

    setLookupLoading(true);
    const requestId = ++requestIdRef.current;
    const normalizedDocument = normalizeDocumentForApi(documentValue);

    debounceRef.current = setTimeout(async () => {
      try {
        const result = await vendorPortalService.resolveCompany(normalizedDocument);
        if (requestId !== requestIdRef.current) return;

        setSource(result.source);
        if (result.name) {
          setName(result.name);
        } else if (result.source === "manual") {
          setName("");
        }
      } catch {
        if (requestId === requestIdRef.current) {
          setSource("manual");
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLookupLoading(false);
        }
      }
    }, RESOLVE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [documentValue, open, t]);

  function handleDocumentChange(value: string) {
    const masked = maskDocumentInput(value);
    const previousLength = getDocumentDigitLength(documentValue);
    const nextLength = getDocumentDigitLength(masked);

    setDocumentValue(masked);

    if (previousLength !== nextLength && (previousLength === 11 || previousLength === 14)) {
      setName("");
      setSource("manual");
    }

    if (documentError) {
      setDocumentError(null);
    }
  }

  function handleDocumentBlur() {
    if (!documentValue.trim()) {
      setDocumentError(null);
      return;
    }

    if (!isCompleteDocument(documentValue)) {
      setDocumentError(t("requestCredit.errors.invalidDocument"));
      return;
    }

    const validation = validateDocument(documentValue);
    setDocumentError(
      validation.valid ? null : t(`requestCredit.errors.${validation.errorKey}`)
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const validation = validateDocument(documentValue);
    if (!validation.valid) {
      setDocumentError(t(`requestCredit.errors.${validation.errorKey}`));
      toast.error(t(`requestCredit.errors.${validation.errorKey}`));
      return;
    }

    if (!name.trim()) {
      toast.error(
        t(isCpfDocument(documentValue) ? "requestCredit.errors.personNameRequired" : "requestCredit.errors.nameRequired")
      );
      return;
    }

    const requestedAmount = parseCurrencyInput(amount);
    if (requestedAmount <= 0) {
      toast.error(t("requestCredit.errors.amountRequired"));
      return;
    }

    setSubmitting(true);
    try {
      await vendorPortalService.createAnalysisRequest({
        document: normalizeDocumentForApi(documentValue),
        name: name.trim(),
        requestedAmount,
      });
      toast.success(t("requestCredit.success"));
      handleClose();
      onCreated?.();
      navigate("/analysis-requests");
    } catch {
      toast.error(t("requestCredit.errors.submitFailed"));
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  const documentIsCpf = isCpfDocument(documentValue);
  const isRegistered = source === "registered";
  const sourceHint =
    source === "registered"
      ? t("requestCredit.registeredCustomer")
      : source === "localization"
        ? t(documentIsCpf ? "requestCredit.localizationFoundPerson" : "requestCredit.localizationFound")
        : null;
  const nameLabel = t(documentIsCpf ? "requestCredit.fields.personName" : "requestCredit.fields.name");
  const namePlaceholder = t(
    documentIsCpf ? "requestCredit.placeholders.personName" : "requestCredit.placeholders.name"
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t("requestCredit.close")}
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-credit-modal-title"
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-[var(--letmesee-border)]",
          "bg-[var(--letmesee-surface)] shadow-xl",
          "mb-[env(safe-area-inset-bottom)] sm:mb-0"
        )}
      >
        <div className="flex items-start justify-between gap-3 border-b border-[var(--letmesee-border)] px-5 py-4">
          <div>
            <h2
              id="request-credit-modal-title"
              className="text-lg font-semibold text-[var(--letmesee-foreground)]"
            >
              {t("requestCredit.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--letmesee-muted)]">
              {t("requestCredit.subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface-subtle)] hover:text-[var(--letmesee-foreground)]"
            aria-label={t("requestCredit.close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <label
                htmlFor="request-credit-document"
                className="text-sm font-medium text-[var(--letmesee-foreground)]"
              >
                {t("requestCredit.fields.document")}
              </label>
              <DocumentHelpPopover />
            </div>
            <div className="relative">
              <Input
                id="request-credit-document"
                autoComplete="off"
                value={documentValue}
                onChange={(event) => handleDocumentChange(event.target.value)}
                onBlur={handleDocumentBlur}
                placeholder={t("requestCredit.placeholders.document")}
                aria-invalid={documentError ? true : undefined}
                aria-describedby={documentError ? "request-credit-document-error" : undefined}
                className={cn(documentError && "border-red-500 focus-visible:ring-red-500/30")}
              />
              {lookupLoading ? (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[var(--letmesee-muted)]" />
              ) : null}
            </div>
            {documentError ? (
              <p id="request-credit-document-error" className="text-xs text-red-600 dark:text-red-400">
                {documentError}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="request-credit-name" className="text-sm font-medium text-[var(--letmesee-foreground)]">
                {nameLabel}
              </label>
              {sourceHint ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                    isRegistered
                      ? "bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]"
                      : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  )}
                >
                  {sourceHint}
                </span>
              ) : null}
            </div>
            <Input
              id="request-credit-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={namePlaceholder}
              readOnly={isRegistered}
              className={cn(isRegistered && "bg-[var(--letmesee-surface-subtle)]")}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="request-credit-amount" className="text-sm font-medium text-[var(--letmesee-foreground)]">
              {t("requestCredit.fields.amount")}
            </label>
            <Input
              id="request-credit-amount"
              inputMode="numeric"
              value={amount}
              onChange={(event) => setAmount(maskCurrencyInput(event.target.value))}
              placeholder={t("requestCredit.placeholders.amount")}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={submitting}
            >
              {t("requestCredit.cancel")}
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting || lookupLoading}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("requestCredit.submitting")}
                </>
              ) : (
                t("requestCredit.submit")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

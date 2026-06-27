import { getActiveLocale } from "@/i18n";

export function formatCurrency(
  value: number | null | undefined,
  locale?: string
): string {
  const amount = Number(value ?? 0);
  const activeLocale = locale ?? getActiveLocale();
  return new Intl.NumberFormat(activeLocale, {
    style: "currency",
    currency: "BRL",
  }).format(amount);
}

export function formatDate(
  value: string | null | undefined,
  locale?: string
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(locale ?? getActiveLocale());
}

export function formatDocument(document: string): string {
  const digits = document.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (digits.length === 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }
  return document;
}

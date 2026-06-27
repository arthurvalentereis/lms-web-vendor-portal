import { formatCnpj, onlyDigits } from "@/lib/cnpj";

export type DocumentKind = "cpf" | "cnpj" | "international" | "empty" | "incomplete";

export function formatCpf(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function hasNonDigitCharacters(value: string): boolean {
  return /[a-zA-Z]/.test(value);
}

export function maskDocumentInput(value: string): string {
  if (hasNonDigitCharacters(value)) {
    return value.replace(/[^a-zA-Z0-9\s\-./]/g, "").toUpperCase();
  }

  const digits = onlyDigits(value);
  if (digits.length <= 11) {
    return formatCpf(value);
  }

  return formatCnpj(value);
}

export function detectDocumentKind(value: string): DocumentKind {
  const trimmed = value.trim();
  if (!trimmed) return "empty";

  if (hasNonDigitCharacters(trimmed)) {
    const normalized = normalizeDocumentForApi(trimmed);
    return normalized.length >= 3 ? "international" : "incomplete";
  }

  const digits = onlyDigits(trimmed);
  if (digits.length === 11) return "cpf";
  if (digits.length === 14) return "cnpj";
  if (digits.length > 0 && digits.length < 11) return "incomplete";
  if (digits.length > 11 && digits.length < 14) return "incomplete";
  if (digits.length > 14) return "international";

  return "incomplete";
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let index = 0; index < 9; index += 1) {
    sum += Number(digits[index]) * (10 - index);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== Number(digits[9])) return false;

  sum = 0;
  for (let index = 0; index < 10; index += 1) {
    sum += Number(digits[index]) * (11 - index);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  return remainder === Number(digits[10]);
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let index = 0; index < 12; index += 1) {
    sum += Number(digits[index]) * weights1[index];
  }
  let remainder = sum % 11;
  const firstDigit = remainder < 2 ? 0 : 11 - remainder;
  if (firstDigit !== Number(digits[12])) return false;

  sum = 0;
  for (let index = 0; index < 13; index += 1) {
    sum += Number(digits[index]) * weights2[index];
  }
  remainder = sum % 11;
  const secondDigit = remainder < 2 ? 0 : 11 - remainder;
  return secondDigit === Number(digits[13]);
}

export function isCompleteDocument(value: string): boolean {
  const kind = detectDocumentKind(value);
  return kind === "cpf" || kind === "cnpj" || kind === "international";
}

export function getDocumentDigitLength(value: string): number {
  return onlyDigits(value).length;
}

export function shouldResolveDocument(value: string): boolean {
  const validation = validateDocument(value);
  if (!validation.valid) return false;

  const digitLength = getDocumentDigitLength(value);
  return digitLength === 11 || digitLength === 14;
}

export function isCpfDocument(value: string): boolean {
  return getDocumentDigitLength(value) === 11 && detectDocumentKind(value) === "cpf";
}

export function isCnpjDocument(value: string): boolean {
  return getDocumentDigitLength(value) === 14 && detectDocumentKind(value) === "cnpj";
}

export function isResolvableCnpj(value: string): boolean {
  return detectDocumentKind(value) === "cnpj" && isValidCnpj(value);
}

export type DocumentValidationResult =
  | { valid: true; kind: Exclude<DocumentKind, "empty" | "incomplete"> }
  | { valid: false; kind: DocumentKind; errorKey: "invalidCpf" | "invalidCnpj" | "invalidDocument" | "documentRequired" };

export function validateDocument(value: string): DocumentValidationResult {
  const kind = detectDocumentKind(value);

  if (kind === "empty") {
    return { valid: false, kind, errorKey: "documentRequired" };
  }

  if (kind === "incomplete") {
    const digits = onlyDigits(value);
    if (digits.length === 11) {
      return { valid: false, kind, errorKey: "invalidCpf" };
    }
    if (digits.length === 14) {
      return { valid: false, kind, errorKey: "invalidCnpj" };
    }
    return { valid: false, kind, errorKey: "invalidDocument" };
  }

  if (kind === "cpf") {
    return isValidCpf(value)
      ? { valid: true, kind }
      : { valid: false, kind, errorKey: "invalidCpf" };
  }

  if (kind === "cnpj") {
    return isValidCnpj(value)
      ? { valid: true, kind }
      : { valid: false, kind, errorKey: "invalidCnpj" };
  }

  const normalized = normalizeDocumentForApi(value);
  return normalized.length >= 3
    ? { valid: true, kind: "international" }
    : { valid: false, kind, errorKey: "invalidDocument" };
}

export function normalizeDocumentForApi(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  if (!hasNonDigitCharacters(trimmed)) {
    return onlyDigits(trimmed);
  }

  return trimmed.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

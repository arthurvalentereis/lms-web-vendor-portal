import type {
  VendorPortalAnalysisRequest,
  VendorPortalCompanyResolve,
  VendorPortalCustomer,
  VendorPortalDashboard,
  VendorPortalEmployee,
  VendorPortalMonthlyOrdersPoint,
} from "@/models";
import type { PortalBranding } from "@/models/portalBranding";

function pick<T extends Record<string, unknown>>(raw: T, camel: string, pascal: string) {
  return (raw[camel] ?? raw[pascal]) as never;
}

export function normalizeVendorBranding(raw: PortalBranding | Record<string, unknown>): PortalBranding {
  const data = raw as Record<string, unknown>;
  return {
    isCustom: Boolean(pick(data, "isCustom", "IsCustom")),
    isDefaultHost: pick(data, "isDefaultHost", "IsDefaultHost") as boolean | undefined,
    userCompanyId: pick(data, "userCompanyId", "UserCompanyId") as number | null | undefined,
    displayName: String(pick(data, "displayName", "DisplayName") ?? "Letmesee"),
    primaryColor: String(pick(data, "primaryColor", "PrimaryColor") ?? "#835afd"),
    logoUrl: pick(data, "logoUrl", "LogoUrl") as string | null | undefined,
    faviconUrl: pick(data, "faviconUrl", "FaviconUrl") as string | null | undefined,
  };
}

export function normalizeVendorEmployee(raw: VendorPortalEmployee | Record<string, unknown>): VendorPortalEmployee {
  const data = raw as Record<string, unknown>;
  return {
    id: Number(pick(data, "id", "Id")),
    name: String(pick(data, "name", "Name") ?? ""),
    email: String(pick(data, "email", "Email") ?? ""),
    userCompanyId: pick(data, "userCompanyId", "UserCompanyId") as number | null | undefined,
    companyName: pick(data, "companyName", "CompanyName") as string | null | undefined,
  };
}

export function normalizeVendorCustomer(raw: VendorPortalCustomer | Record<string, unknown>): VendorPortalCustomer {
  const data = raw as Record<string, unknown>;
  return {
    id: Number(pick(data, "id", "Id")),
    customerType: String(pick(data, "customerType", "CustomerType") ?? "Pf") as "Pf" | "Pj",
    name: String(pick(data, "name", "Name") ?? ""),
    document: String(pick(data, "document", "Document") ?? ""),
    userCompanyId: pick(data, "userCompanyId", "UserCompanyId") as number | null | undefined,
    creditorName: pick(data, "creditorName", "CreditorName") as string | null | undefined,
  };
}

export function normalizeVendorAnalysisRequest(
  raw: VendorPortalAnalysisRequest | Record<string, unknown>
): VendorPortalAnalysisRequest {
  const data = raw as Record<string, unknown>;
  return {
    id: Number(pick(data, "id", "Id")),
    requestedDate: String(pick(data, "requestedDate", "RequestedDate") ?? ""),
    requestedAmount: Number(pick(data, "requestedAmount", "RequestedAmount") ?? 0),
    statusName: pick(data, "statusName", "StatusName") as string | null | undefined,
    categoryName: pick(data, "categoryName", "CategoryName") as string | null | undefined,
    approved: pick(data, "approved", "Approved") as boolean | null | undefined,
    customerName: pick(data, "customerName", "CustomerName") as string | null | undefined,
    customerDocument: pick(data, "customerDocument", "CustomerDocument") as string | null | undefined,
  };
}

export function normalizeVendorPagedResult<T>(
  raw: Record<string, unknown>,
  mapItem: (item: Record<string, unknown>) => T
) {
  const items = (raw.items ?? raw.Items ?? []) as Record<string, unknown>[];
  return {
    items: items.map(mapItem),
    total: Number(raw.total ?? raw.Total ?? 0),
    page: Number(raw.page ?? raw.Page ?? 1),
    pageSize: Number(raw.pageSize ?? raw.PageSize ?? 10),
  };
}

export function normalizeVendorMonthlyOrdersPoint(
  raw: VendorPortalMonthlyOrdersPoint | Record<string, unknown>
): VendorPortalMonthlyOrdersPoint {
  const data = raw as Record<string, unknown>;
  return {
    monthKey: String(pick(data, "monthKey", "MonthKey") ?? ""),
    label: String(pick(data, "label", "Label") ?? ""),
    orderCount: Number(pick(data, "orderCount", "OrderCount") ?? 0),
    totalAmount: Number(pick(data, "totalAmount", "TotalAmount") ?? 0),
  };
}

export function normalizeVendorDashboard(raw: VendorPortalDashboard | Record<string, unknown>): VendorPortalDashboard {
  const data = raw as Record<string, unknown>;
  const kpisRaw = (pick(data, "kpis", "Kpis") ?? {}) as Record<string, unknown>;
  const recentCustomers = (pick(data, "recentCustomers", "RecentCustomers") ?? []) as Record<string, unknown>[];
  const recentAnalysisRequests = (pick(data, "recentAnalysisRequests", "RecentAnalysisRequests") ?? []) as Record<string, unknown>[];
  const monthlyOrders = (pick(data, "monthlyOrders", "MonthlyOrders") ?? []) as Record<string, unknown>[];

  return {
    kpis: {
      activeCustomersCount: Number(
        pick(kpisRaw, "activeCustomersCount", "ActiveCustomersCount") ?? 0
      ),
      totalAnalysisRequests: Number(
        pick(kpisRaw, "totalAnalysisRequests", "TotalAnalysisRequests") ?? 0
      ),
      inAnalysisCount: Number(pick(kpisRaw, "inAnalysisCount", "InAnalysisCount") ?? 0),
      approvedCount: Number(pick(kpisRaw, "approvedCount", "ApprovedCount") ?? 0),
      rejectedCount: Number(pick(kpisRaw, "rejectedCount", "RejectedCount") ?? 0),
    },
    monthlyOrders: monthlyOrders.map(normalizeVendorMonthlyOrdersPoint),
    recentCustomers: recentCustomers.map(normalizeVendorCustomer),
    recentAnalysisRequests: recentAnalysisRequests.map(normalizeVendorAnalysisRequest),
  };
}

export function normalizeVendorCompanyResolve(
  raw: VendorPortalCompanyResolve | Record<string, unknown>
): VendorPortalCompanyResolve {
  const data = raw as Record<string, unknown>;
  const source = String(pick(data, "source", "Source") ?? "manual");
  const normalizedSource =
    source === "registered" || source === "localization" ? source : "manual";

  const customerTypeRaw = pick(data, "customerType", "CustomerType");
  const customerType =
    customerTypeRaw === "Pf" || customerTypeRaw === "Pj" ? customerTypeRaw : null;

  return {
    document: String(pick(data, "document", "Document") ?? ""),
    name: (pick(data, "name", "Name") as string | null | undefined) ?? null,
    source: normalizedSource,
    customerId: pick(data, "customerId", "CustomerId") as number | null | undefined,
    customerType,
    userCompanyId: pick(data, "userCompanyId", "UserCompanyId") as number | null | undefined,
  };
}

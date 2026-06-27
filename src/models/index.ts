export interface VendorPortalEmployee {
  id: number;
  name: string;
  email: string;
  userCompanyId?: number | null;
  companyName?: string | null;
}

export interface VendorPortalAuthResponse {
  token: string;
  expiresAt: string;
  employee: VendorPortalEmployee;
}

export interface VendorPortalCustomer {
  id: number;
  customerType: "Pf" | "Pj";
  name: string;
  document: string;
  userCompanyId?: number | null;
  creditorName?: string | null;
}

export interface VendorPortalAnalysisRequest {
  id: number;
  requestedDate: string;
  requestedAmount: number;
  statusName?: string | null;
  categoryName?: string | null;
  approved?: boolean | null;
  customerName?: string | null;
  customerDocument?: string | null;
}

export interface VendorPortalDashboardKpis {
  activeCustomersCount: number;
  totalAnalysisRequests: number;
  inAnalysisCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface VendorPortalMonthlyOrdersPoint {
  monthKey: string;
  label: string;
  orderCount: number;
  totalAmount: number;
}

export interface VendorPortalDashboard {
  kpis: VendorPortalDashboardKpis;
  monthlyOrders: VendorPortalMonthlyOrdersPoint[];
  recentCustomers: VendorPortalCustomer[];
  recentAnalysisRequests: VendorPortalAnalysisRequest[];
}

export interface VendorPortalPagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type VendorPortalCompanyResolveSource = "registered" | "localization" | "manual";

export interface VendorPortalCompanyResolve {
  document: string;
  name?: string | null;
  source: VendorPortalCompanyResolveSource;
  customerId?: number | null;
  customerType?: "Pf" | "Pj" | null;
  userCompanyId?: number | null;
}

export interface CreateVendorPortalAnalysisRequestPayload {
  document: string;
  name: string;
  requestedAmount: number;
}

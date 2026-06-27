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

export interface VendorPortalDashboard {
  kpis: VendorPortalDashboardKpis;
  recentCustomers: VendorPortalCustomer[];
  recentAnalysisRequests: VendorPortalAnalysisRequest[];
}

export interface VendorPortalPagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

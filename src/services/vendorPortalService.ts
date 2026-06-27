import type {
  CreateVendorPortalAnalysisRequestPayload,
  VendorPortalDashboard,
  VendorPortalEmployee,
} from "@/models";
import type { PortalBranding } from "@/models/portalBranding";
import {
  normalizeVendorAnalysisRequest,
  normalizeVendorBranding,
  normalizeVendorCompanyResolve,
  normalizeVendorCustomer,
  normalizeVendorDashboard,
  normalizeVendorEmployee,
  normalizeVendorPagedResult,
} from "@/lib/normalizeVendorPortal";
import { normalizeDocumentForApi } from "@/lib/document";
import { api } from "./api";

export const vendorPortalService = {
  getBranding: async (host: string) => {
    const { data } = await api.get<PortalBranding>("/vendor-portal/branding", {
      params: { host },
    });
    return normalizeVendorBranding(data);
  },

  requestMagicLink: async (email: string) => {
    await api.post("/vendor-portal/magic-link", { email });
  },

  verifyMagicLink: async (token: string) => {
    const { data } = await api.post<Record<string, unknown>>(
      "/vendor-portal/verify-magic-link",
      { token }
    );
    return {
      token: String(data.token ?? data.Token ?? ""),
      expiresAt: String(data.expiresAt ?? data.ExpiresAt ?? ""),
      employee: normalizeVendorEmployee(
        (data.employee ?? data.Employee ?? {}) as Record<string, unknown>
      ),
    };
  },

  getMe: async () => {
    const { data } = await api.get<VendorPortalEmployee>("/vendor-portal/me");
    return normalizeVendorEmployee(data);
  },

  getDashboard: async () => {
    const { data } = await api.get<VendorPortalDashboard>("/vendor-portal/dashboard");
    return normalizeVendorDashboard(data);
  },

  getCustomers: async (page = 1, pageSize = 10) => {
    const { data } = await api.get<Record<string, unknown>>("/vendor-portal/customers", {
      params: { page, pageSize },
    });
    return normalizeVendorPagedResult(data, normalizeVendorCustomer);
  },

  getAnalysisRequests: async (page = 1, pageSize = 10) => {
    const { data } = await api.get<Record<string, unknown>>(
      "/vendor-portal/analysis-requests",
      { params: { page, pageSize } }
    );
    return normalizeVendorPagedResult(data, normalizeVendorAnalysisRequest);
  },

  quickSearch: async (query: string, limit = 20) => {
    const { data } = await api.get<Record<string, unknown>>("/vendor-portal/search", {
      params: { q: query, limit },
    });
    const customers = (data.customers ?? data.Customers ?? []) as Record<string, unknown>[];
    const analysisRequests = (data.analysisRequests ?? data.AnalysisRequests ?? []) as Record<
      string,
      unknown
    >[];

    return {
      customers: customers.map(normalizeVendorCustomer),
      analysisRequests: analysisRequests.map(normalizeVendorAnalysisRequest),
    };
  },

  resolveCompany: async (document: string) => {
    const { data } = await api.get<Record<string, unknown>>("/vendor-portal/companies/resolve", {
      params: { cnpj: normalizeDocumentForApi(document) },
    });
    return normalizeVendorCompanyResolve(data);
  },

  createAnalysisRequest: async (payload: CreateVendorPortalAnalysisRequestPayload) => {
    const { data } = await api.post<Record<string, unknown>>(
      "/vendor-portal/analysis-requests",
      {
        document: normalizeDocumentForApi(payload.document),
        name: payload.name.trim(),
        requestedAmount: payload.requestedAmount,
      }
    );
    return normalizeVendorAnalysisRequest(data);
  },
};

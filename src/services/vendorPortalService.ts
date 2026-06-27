import type { VendorPortalDashboard, VendorPortalEmployee } from "@/models";
import {
  normalizeVendorAnalysisRequest,
  normalizeVendorCustomer,
  normalizeVendorDashboard,
  normalizeVendorEmployee,
  normalizeVendorPagedResult,
} from "@/lib/normalizeVendorPortal";
import { api } from "./api";

export const vendorPortalService = {
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
};

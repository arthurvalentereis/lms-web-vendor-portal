import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_PORTAL_BRANDING,
  type PortalBranding,
} from "@/models/portalBranding";
import { applyPortalBranding, clearPortalBranding } from "@/lib/portalBranding";
import { vendorPortalService } from "@/services/vendorPortalService";

interface VendorBrandingContextValue {
  branding: PortalBranding | null;
  loading: boolean;
}

const VendorBrandingContext = createContext<VendorBrandingContextValue>({
  branding: null,
  loading: true,
});

function resolveBrandingFromApi(data: PortalBranding): PortalBranding {
  if (data.isCustom) {
    return {
      isCustom: true,
      isDefaultHost: false,
      userCompanyId: data.userCompanyId,
      displayName: data.displayName || "Portal Comercial",
      primaryColor: data.primaryColor || DEFAULT_PORTAL_BRANDING.primaryColor,
      logoUrl: data.logoUrl,
      faviconUrl: data.faviconUrl,
    };
  }

  return {
    ...DEFAULT_PORTAL_BRANDING,
    isDefaultHost: data.isDefaultHost ?? true,
    userCompanyId: null,
    logoUrl: null,
    faviconUrl: null,
  };
}

export function VendorBrandingProvider({ children }: { children: ReactNode }) {
  const [branding, setBranding] = useState<PortalBranding | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    clearPortalBranding();

    vendorPortalService
      .getBranding(window.location.host)
      .then((data) => {
        if (!active) return;
        const resolved = resolveBrandingFromApi(data);
        setBranding(resolved);
        applyPortalBranding(resolved);
      })
      .catch(() => {
        if (!active) return;
        const fallback = { ...DEFAULT_PORTAL_BRANDING, isDefaultHost: true };
        setBranding(fallback);
        applyPortalBranding(fallback);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      branding,
      loading,
    }),
    [branding, loading]
  );

  return (
    <VendorBrandingContext.Provider value={value}>{children}</VendorBrandingContext.Provider>
  );
}

export function useVendorBranding() {
  return useContext(VendorBrandingContext);
}

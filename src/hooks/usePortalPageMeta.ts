import { useMemo } from "react";
import { useVendorBranding } from "@/contexts/VendorBrandingContext";

const DEFAULT_SITE_NAME = "Letmesee";

export function usePortalPageMeta() {
  const { branding } = useVendorBranding();

  return useMemo(() => {
    const siteName = branding?.isCustom ? branding.displayName : DEFAULT_SITE_NAME;

    function buildTitle(pageTitle: string) {
      return branding?.isCustom ? `${branding.displayName} - ${pageTitle}` : pageTitle;
    }

    return { siteName, buildTitle };
  }, [branding]);
}

export interface PortalBranding {
  isCustom: boolean;
  isDefaultHost?: boolean;
  userCompanyId?: number | null;
  displayName: string;
  primaryColor: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
}

export const DEFAULT_PORTAL_BRANDING: PortalBranding = {
  isCustom: false,
  isDefaultHost: true,
  displayName: "Letmesee",
  primaryColor: "#835afd",
};

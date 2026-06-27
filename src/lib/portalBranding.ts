import type { PortalBranding } from "@/models/portalBranding";

export interface PortalPalette {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  primarySoft: string;
  border: string;
  onPrimary: string;
}

const LETMESEE_PURPLE_VARS = [
  "--letmesee-purple",
  "--letmesee-purple-dark",
  "--letmesee-purple-medium",
  "--letmesee-purple-light",
  "--letmesee-logo-purple",
] as const;

const NEUTRAL_THEME_COLOR = "#f4f4f5";
const DEFAULT_FAVICON = "/favicon.svg";
const DEFAULT_APPLE_TOUCH_ICON = "/pwa/apple-touch-icon.png";
const DEFAULT_PWA_MANIFEST_PATH = "/manifest.webmanifest";

const DEFAULT_PWA_MANIFEST = {
  name: "Portal Comercial Letmesee",
  short_name: "Comercial",
  description:
    "Acompanhe clientes e pedidos de crédito com acesso seguro via magic link.",
  lang: "pt-BR",
  start_url: "/login",
  scope: "/",
  display: "standalone",
  theme_color: "#835afd",
  background_color: "#f8f9fc",
  icons: [
    {
      src: "/pwa/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/pwa/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/pwa/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "maskable",
    },
  ],
} as const;

let manifestBlobUrl: string | null = null;

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(hex: string, target: { r: number; g: number; b: number }, amount: number) {
  const source = hexToRgb(hex);
  return rgbToHex(
    Math.round(source.r + (target.r - source.r) * amount),
    Math.round(source.g + (target.g - source.g) * amount),
    Math.round(source.b + (target.b - source.b) * amount)
  );
}

export function derivePortalPalette(hex: string): PortalPalette {
  const primary = hex.startsWith("#") ? hex : `#${hex}`;
  return {
    primary,
    primaryDark: mix(primary, { r: 0, g: 0, b: 0 }, 0.18),
    primaryLight: mix(primary, { r: 255, g: 255, b: 255 }, 0.35),
    primarySoft: mix(primary, { r: 255, g: 255, b: 255 }, 0.88),
    border: mix(primary, { r: 255, g: 255, b: 255 }, 0.72),
    onPrimary: "#ffffff",
  };
}

export function getBrandInitials(name?: string) {
  if (!name?.trim()) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function setLinkRel(rel: string, href: string) {
  let link = document.querySelector<HTMLLinkElement>(`link[rel='${rel}']`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
}

function setFavicon(href: string) {
  setLinkRel("icon", href);
}

function setAppleTouchIcon(href: string) {
  setLinkRel("apple-touch-icon", href);
}

function getShortName(displayName: string) {
  const trimmed = displayName.trim();
  if (trimmed.length <= 12) return trimmed;
  return trimmed.slice(0, 12).trim();
}

function inferIconType(url: string) {
  if (url.startsWith("data:image/svg")) return "image/svg+xml";
  if (url.startsWith("data:image/png")) return "image/png";
  if (url.startsWith("data:image/jpeg") || url.startsWith("data:image/jpg")) {
    return "image/jpeg";
  }
  if (url.endsWith(".svg")) return "image/svg+xml";
  if (url.endsWith(".png")) return "image/png";
  if (url.endsWith(".jpg") || url.endsWith(".jpeg")) return "image/jpeg";
  return "image/png";
}

function buildPwaIcons(branding: PortalBranding) {
  if (branding.isCustom && branding.faviconUrl) {
    const type = inferIconType(branding.faviconUrl);
    return [
      { src: branding.faviconUrl, sizes: "192x192", type, purpose: "any" },
      { src: branding.faviconUrl, sizes: "512x512", type, purpose: "any" },
      { src: branding.faviconUrl, sizes: "512x512", type, purpose: "maskable" },
    ];
  }

  return DEFAULT_PWA_MANIFEST.icons.map((icon) => ({ ...icon }));
}

function resetPwaManifestLink() {
  if (manifestBlobUrl) {
    URL.revokeObjectURL(manifestBlobUrl);
    manifestBlobUrl = null;
  }
  setLinkRel("manifest", DEFAULT_PWA_MANIFEST_PATH);
}

export function applyPortalPwaManifest(branding: PortalBranding) {
  const palette = derivePortalPalette(branding.primaryColor);
  const manifest = {
    ...DEFAULT_PWA_MANIFEST,
    name: branding.isCustom ? branding.displayName : DEFAULT_PWA_MANIFEST.name,
    short_name: branding.isCustom
      ? getShortName(branding.displayName)
      : DEFAULT_PWA_MANIFEST.short_name,
    theme_color: palette.primary,
    icons: buildPwaIcons(branding),
  };

  if (manifestBlobUrl) {
    URL.revokeObjectURL(manifestBlobUrl);
  }

  manifestBlobUrl = URL.createObjectURL(
    new Blob([JSON.stringify(manifest)], { type: "application/json" })
  );
  setLinkRel("manifest", manifestBlobUrl);
}

function setThemeColor(color: string) {
  const themeMeta = document.querySelector<HTMLMetaElement>("meta[name='theme-color']");
  if (themeMeta) {
    themeMeta.content = color;
  }
}

function resetLetmeseePurpleVars() {
  const root = document.documentElement;
  for (const variable of LETMESEE_PURPLE_VARS) {
    root.style.removeProperty(variable);
  }
}

export function clearPortalBranding() {
  resetLetmeseePurpleVars();
  setThemeColor(NEUTRAL_THEME_COLOR);
  setFavicon(DEFAULT_FAVICON);
  setAppleTouchIcon(DEFAULT_APPLE_TOUCH_ICON);
  resetPwaManifestLink();
}

function applyPortalIcons(branding: PortalBranding) {
  if (branding.isCustom) {
    if (branding.faviconUrl) {
      setFavicon(branding.faviconUrl);
      setAppleTouchIcon(branding.faviconUrl);
      return;
    }

    setFavicon(DEFAULT_FAVICON);
    setAppleTouchIcon(DEFAULT_APPLE_TOUCH_ICON);
    return;
  }

  setFavicon(DEFAULT_FAVICON);
  setAppleTouchIcon(DEFAULT_APPLE_TOUCH_ICON);
}

export function applyPortalBranding(branding: PortalBranding) {
  const palette = derivePortalPalette(branding.primaryColor);
  const root = document.documentElement;

  root.style.setProperty("--portal-primary", palette.primary);
  root.style.setProperty("--portal-primary-dark", palette.primaryDark);
  root.style.setProperty("--portal-primary-light", palette.primaryLight);
  root.style.setProperty("--portal-primary-soft", palette.primarySoft);

  if (branding.isCustom) {
    root.style.setProperty("--letmesee-purple", palette.primary);
    root.style.setProperty("--letmesee-purple-dark", palette.primaryDark);
    root.style.setProperty("--letmesee-purple-medium", palette.primaryLight);
    root.style.setProperty("--letmesee-purple-light", palette.primaryLight);
    root.style.setProperty("--letmesee-logo-purple", palette.primaryDark);
  } else {
    resetLetmeseePurpleVars();
  }

  applyPortalIcons(branding);
  setThemeColor(palette.primary);
  applyPortalPwaManifest(branding);
}

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getBrandInitials } from "@/lib/portalBranding";
import { useVendorBranding } from "@/contexts/VendorBrandingContext";

interface VendorBrandLogoProps {
  className?: string;
  inverted?: boolean;
  alt?: string;
  avatar?: boolean;
  featuredSurface?: "gradient" | "surface";
}

const LOGO_HEIGHT_DEFAULT = "h-11";
const LOGO_HEIGHT_FEATURED = "h-[3.3rem]";
const LOGO_HEIGHT_INITIALS_FEATURED = "h-[4.4rem]";
const LOGO_MAX_WIDTH = "max-w-[15.4rem]";

function FeaturedShell({
  children,
  className,
  surface,
}: {
  children: ReactNode;
  className?: string;
  surface: "gradient" | "surface";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border px-3 py-2 backdrop-blur-sm",
        surface === "gradient"
          ? "border-white/20 bg-white/10"
          : "border-[var(--letmesee-border)] bg-[var(--letmesee-purple)]/5",
        className
      )}
    >
      {children}
    </span>
  );
}

export function VendorBrandLogo({
  className,
  inverted = false,
  alt,
  avatar = false,
  featuredSurface = "gradient",
}: VendorBrandLogoProps) {
  const { branding } = useVendorBranding();

  if (!branding) {
    return null;
  }

  const label = alt ?? branding.displayName;

  function wrapFeatured(content: ReactNode) {
    if (!avatar) return content;
    return (
      <FeaturedShell surface={featuredSurface} className={className}>
        {content}
      </FeaturedShell>
    );
  }

  if (branding.isCustom && branding.logoUrl) {
    return wrapFeatured(
      <img
        src={branding.logoUrl}
        alt={label}
        className={cn(
          `${LOGO_HEIGHT_DEFAULT} w-auto ${LOGO_MAX_WIDTH} object-contain`,
          avatar && LOGO_HEIGHT_FEATURED,
          !avatar && className
        )}
      />
    );
  }

  if (branding.isCustom) {
    const initials = getBrandInitials(branding.displayName);
    const initialsNode = (
      <span
        className={cn(
          "inline-flex min-w-8 items-center justify-center text-sm font-semibold",
          avatar
            ? `${LOGO_HEIGHT_INITIALS_FEATURED} text-lg text-white`
            : `${LOGO_HEIGHT_DEFAULT} rounded-xl bg-[var(--letmesee-purple)]/15 px-2 text-xs text-[var(--letmesee-purple)]`,
          !avatar && className
        )}
        aria-label={label}
      >
        {initials}
      </span>
    );
    return wrapFeatured(initialsNode);
  }

  return wrapFeatured(
    <img
      src="/assets/logo-letmesee.svg"
      alt={label}
      className={cn(
        `${LOGO_HEIGHT_DEFAULT} w-auto object-contain`,
        avatar && LOGO_HEIGHT_FEATURED,
        inverted && "brightness-0 invert",
        !avatar && className
      )}
    />
  );
}

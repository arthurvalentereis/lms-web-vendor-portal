import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VendorBrandLogoProps {
  className?: string;
  inverted?: boolean;
  alt?: string;
  avatar?: boolean;
  featuredSurface?: "gradient" | "surface";
}

const LOGO_HEIGHT_DEFAULT = "h-11";
const LOGO_HEIGHT_FEATURED = "h-[3.3rem]";

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
  alt = "Letmesee",
  avatar = false,
  featuredSurface = "gradient",
}: VendorBrandLogoProps) {
  const logo = (
    <img
      src="/assets/logo-letmesee.svg"
      alt={alt}
      className={cn(
        `${LOGO_HEIGHT_DEFAULT} w-auto object-contain`,
        avatar && LOGO_HEIGHT_FEATURED,
        inverted && "brightness-0 invert",
        !avatar && className
      )}
    />
  );

  if (!avatar) return logo;

  return (
    <FeaturedShell surface={featuredSurface} className={className}>
      {logo}
    </FeaturedShell>
  );
}

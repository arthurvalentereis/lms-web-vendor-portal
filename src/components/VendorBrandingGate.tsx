import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useVendorBranding } from "@/contexts/VendorBrandingContext";

export function VendorBrandingGate({ children }: { children: ReactNode }) {
  const { loading } = useVendorBranding();

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--letmesee-background)]"
        aria-busy="true"
        aria-label="Carregando portal"
      >
        <Loader2 className="h-8 w-8 animate-spin text-[var(--letmesee-muted)]" />
      </div>
    );
  }

  return <>{children}</>;
}

import { BrowserRouter } from "react-router-dom";
import { ThemeAwareToaster } from "@/components/ThemeAwareToaster";
import { VendorBrandingGate } from "@/components/VendorBrandingGate";
import { VendorAuthProvider } from "@/contexts/VendorAuthContext";
import { VendorBrandingProvider } from "@/contexts/VendorBrandingContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AppRoutes } from "@/routes";
import { AuthSessionSync } from "@/components/AuthSessionSync";

export default function App() {
  return (
    <ThemeProvider>
      <VendorBrandingProvider>
        <VendorBrandingGate>
          <VendorAuthProvider>
            <BrowserRouter>
              <AuthSessionSync />
              <AppRoutes />
              <ThemeAwareToaster />
            </BrowserRouter>
          </VendorAuthProvider>
        </VendorBrandingGate>
      </VendorBrandingProvider>
    </ThemeProvider>
  );
}

import { BrowserRouter } from "react-router-dom";
import { ThemeAwareToaster } from "@/components/ThemeAwareToaster";
import { VendorAuthProvider } from "@/contexts/VendorAuthContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AppRoutes } from "@/routes";
import { AuthSessionSync } from "@/components/AuthSessionSync";

export default function App() {
  return (
    <ThemeProvider>
      <VendorAuthProvider>
        <BrowserRouter>
          <AuthSessionSync />
          <AppRoutes />
          <ThemeAwareToaster />
        </BrowserRouter>
      </VendorAuthProvider>
    </ThemeProvider>
  );
}

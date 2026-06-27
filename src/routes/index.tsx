import { Navigate, Route, Routes } from "react-router-dom";
import { VendorLayout } from "@/layouts/VendorLayout";
import { DashboardPage } from "@/pages/Dashboard";
import { CustomersPage } from "@/pages/Customers";
import { AnalysisRequestsPage } from "@/pages/AnalysisRequests";
import { LoginPage } from "@/pages/Login";
import { VerifyMagicLinkPage } from "@/pages/VerifyMagicLink";
import { PrivateRoute } from "@/routes/PrivateRoute";
import { useVendorAuth } from "@/contexts/VendorAuthContext";

function HomeRedirect() {
  const { isAuthenticated } = useVendorAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/verify" element={<VerifyMagicLinkPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<VendorLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/analysis-requests" element={<AnalysisRequestsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

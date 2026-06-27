import { Navigate, Outlet } from "react-router-dom";
import { useVendorAuth } from "@/contexts/VendorAuthContext";

export function PrivateRoute() {
  const { isAuthenticated } = useVendorAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { setUnauthorizedHandler } from "@/lib/authSession";

export function AuthSessionSync() {
  const navigate = useNavigate();
  const { signOut } = useVendorAuth();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut();
      navigate("/login", { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate, signOut]);

  return null;
}

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { VendorPortalAuthResponse, VendorPortalEmployee } from "@/models";
import { normalizeVendorEmployee } from "@/lib/normalizeVendorPortal";
import { TOKEN_KEY } from "@/services/api";

const EMPLOYEE_KEY = "@VendorPortal:employee";

interface VendorAuthContextValue {
  token: string | null;
  employee: VendorPortalEmployee | null;
  isAuthenticated: boolean;
  signIn: (response: VendorPortalAuthResponse) => void;
  signOut: () => void;
}

const VendorAuthContext = createContext<VendorAuthContextValue | undefined>(
  undefined
);

function readStoredEmployee(): VendorPortalEmployee | null {
  const raw = localStorage.getItem(EMPLOYEE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VendorPortalEmployee;
  } catch {
    return null;
  }
}

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY)
  );
  const [employee, setEmployee] = useState<VendorPortalEmployee | null>(
    readStoredEmployee
  );

  const signIn = useCallback((response: VendorPortalAuthResponse) => {
    const normalizedEmployee = normalizeVendorEmployee(response.employee);
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(normalizedEmployee));
    setToken(response.token);
    setEmployee(normalizedEmployee);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMPLOYEE_KEY);
    setToken(null);
    setEmployee(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      employee,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    }),
    [token, employee, signIn, signOut]
  );

  return (
    <VendorAuthContext.Provider value={value}>{children}</VendorAuthContext.Provider>
  );
}

export function useVendorAuth() {
  const context = useContext(VendorAuthContext);
  if (!context) {
    throw new Error("useVendorAuth must be used within VendorAuthProvider");
  }
  return context;
}

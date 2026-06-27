import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { RequestCreditModal } from "@/components/RequestCreditModal";

interface RequestCreditModalContextValue {
  openRequestCredit: () => void;
  requestCreatedVersion: number;
  notifyRequestCreated: () => void;
}

const RequestCreditModalContext = createContext<RequestCreditModalContextValue | null>(null);

export function RequestCreditModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [requestCreatedVersion, setRequestCreatedVersion] = useState(0);

  const openRequestCredit = useCallback(() => {
    setOpen(true);
  }, []);

  const notifyRequestCreated = useCallback(() => {
    setRequestCreatedVersion((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({
      openRequestCredit,
      requestCreatedVersion,
      notifyRequestCreated,
    }),
    [openRequestCredit, requestCreatedVersion, notifyRequestCreated]
  );

  return (
    <RequestCreditModalContext.Provider value={value}>
      {children}
      <RequestCreditModal
        open={open}
        onClose={() => setOpen(false)}
        onCreated={notifyRequestCreated}
      />
    </RequestCreditModalContext.Provider>
  );
}

export function useRequestCreditModal() {
  const context = useContext(RequestCreditModalContext);
  if (!context) {
    throw new Error("useRequestCreditModal must be used within RequestCreditModalProvider");
  }
  return context;
}

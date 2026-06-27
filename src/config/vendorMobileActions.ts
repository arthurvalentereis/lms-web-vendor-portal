import type { LucideIcon } from "lucide-react";
import { CreditCard } from "lucide-react";

export type VendorMobileActionHandler = "request-credit";

export type VendorMobileAction = {
  id: string;
  labelKey: string;
  shortLabelKey?: string;
  icon?: LucideIcon;
  variant: "primary" | "secondary";
  handler: VendorMobileActionHandler;
};

export const vendorMobileActions: VendorMobileAction[] = [
  {
    id: "request-credit",
    labelKey: "actions.requestCredit",
    shortLabelKey: "actions.requestCreditShort",
    icon: CreditCard,
    variant: "primary",
    handler: "request-credit",
  },
];

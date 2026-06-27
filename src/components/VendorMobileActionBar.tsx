import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import type { VendorMobileActionHandler } from "@/config/vendorMobileActions";
import { cn } from "@/lib/utils";

interface VendorMobileActionBarProps {
  onAction: (handler: VendorMobileActionHandler) => void;
}

type TabConfig =
  | {
      kind: "link";
      to: string;
      icon: LucideIcon;
      labelKey: string;
      shortLabelKey?: string;
    }
  | {
      kind: "action";
      handler: VendorMobileActionHandler;
      icon: LucideIcon;
      labelKey: string;
      shortLabelKey: string;
    };

const mobileTabs: TabConfig[] = [
  { kind: "link", to: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { kind: "link", to: "/customers", icon: Users, labelKey: "customers" },
  {
    kind: "action",
    handler: "request-credit",
    icon: CreditCard,
    labelKey: "actions.requestCredit",
    shortLabelKey: "actions.requestCreditShort",
  },
  {
    kind: "link",
    to: "/analysis-requests",
    icon: ClipboardList,
    labelKey: "analysisRequests",
    shortLabelKey: "analysisRequestsShort",
  },
];

function TabButton({
  icon: Icon,
  label,
  active,
  emphasized,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  emphasized?: boolean;
  onClick?: () => void;
}) {
  const className = cn(
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1",
    "rounded-lg transition-colors active:opacity-80"
  );

  const content = (
    <>
      <Icon
        className={cn(
          "h-[1.35rem] w-[1.35rem] shrink-0 stroke-[1.75]",
          active || emphasized
            ? "text-[var(--letmesee-purple)]"
            : "text-[var(--letmesee-muted)]"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "max-w-full truncate text-[10px] leading-none",
          active || emphasized
            ? "font-medium text-[var(--letmesee-purple)]"
            : "font-normal text-[var(--letmesee-muted)]"
        )}
      >
        {label}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-label={label}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}

export function VendorMobileActionBar({ onAction }: VendorMobileActionBarProps) {
  const { t } = useTranslation("common");

  return (
    <footer
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-[var(--letmesee-border)]/70",
        "bg-[var(--letmesee-surface)]/92 backdrop-blur-lg",
        "shadow-[0_-1px_8px_rgba(15,23,42,0.05)] dark:shadow-[0_-1px_8px_rgba(0,0,0,0.2)]",
        "lg:hidden"
      )}
      style={{
        paddingBottom: "max(0.125rem, env(safe-area-inset-bottom))",
      }}
    >
      <nav
        className="mx-auto flex h-[3.25rem] max-w-lg items-stretch px-1 pt-0.5"
        aria-label={t("menu")}
      >
        {mobileTabs.map((tab) => {
          if (tab.kind === "action") {
            return (
              <TabButton
                key={tab.handler}
                icon={tab.icon}
                label={t(tab.shortLabelKey)}
                emphasized
                onClick={() => onAction(tab.handler)}
              />
            );
          }

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className="flex min-w-0 flex-1"
              aria-label={t(tab.labelKey)}
            >
              {({ isActive }) => (
                <TabButton
                  icon={tab.icon}
                  label={t(tab.shortLabelKey ?? tab.labelKey)}
                  active={isActive}
                />
              )}
            </NavLink>
          );
        })}
      </nav>
    </footer>
  );
}

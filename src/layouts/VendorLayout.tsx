import { useEffect, useState } from "react";
import {
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Users,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { PwaInstallHint } from "@/components/PwaInstallHint";
import {
  RequestCreditModalProvider,
  useRequestCreditModal,
} from "@/contexts/RequestCreditModalContext";
import { RequestCreditTriggerButton } from "@/components/RequestCreditTriggerButton";
import { VendorQuickSearchDialog, VendorQuickSearchTrigger } from "@/components/VendorQuickSearch";
import { useVendorQuickSearch } from "@/components/VendorQuickSearch/useVendorQuickSearch";
import { VendorBrandLogo } from "@/components/VendorBrandLogo";
import { VendorMobileActionBar } from "@/components/VendorMobileActionBar";
import { PortalPreferences } from "@/components/preferences";
import type { VendorMobileActionHandler } from "@/config/vendorMobileActions";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { useVendorBranding } from "@/contexts/VendorBrandingContext";
import { cn } from "@/lib/utils";

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useTranslation("common");

  const items = [
    { to: "/dashboard", icon: LayoutDashboard, label: t("dashboard") },
    { to: "/customers", icon: Users, label: t("customers") },
    { to: "/analysis-requests", icon: ClipboardList, label: t("analysisRequests") },
  ];

  return (
    <nav className="flex flex-col gap-0.5 px-3 py-4">
      <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--letmesee-muted)]">
        {t("menu")}
      </p>
      {items.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-[var(--letmesee-surface)] text-[var(--letmesee-foreground)] shadow-sm ring-1 ring-[var(--letmesee-border)]"
                : "text-[var(--letmesee-muted)] hover:bg-[var(--letmesee-surface)]/70 hover:text-[var(--letmesee-foreground)]"
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0 opacity-70" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter({ onSignOut }: { onSignOut: () => void }) {
  const { employee } = useVendorAuth();
  const { t } = useTranslation("common");

  return (
    <div className="shrink-0 space-y-3 border-t border-[var(--letmesee-sidebar-border)] bg-[var(--letmesee-sidebar)] p-4 backdrop-blur-md">
      <PortalPreferences variant="sidebar" />

      {employee ? (
        <div className="rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-3">
          <p className="truncate text-sm font-medium text-[var(--letmesee-foreground)]">
            {employee.name}
          </p>
          <p className="truncate text-xs text-[var(--letmesee-muted)]">{employee.email}</p>
          {employee.companyName ? (
            <p className="mt-1 truncate text-[11px] text-[var(--letmesee-muted)]">
              {employee.companyName}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onSignOut}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface)] hover:text-[var(--letmesee-foreground)]"
      >
        <LogOut className="h-4 w-4 shrink-0 opacity-70" />
        {t("signOut")}
      </button>
    </div>
  );
}

function SidebarBrand({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation("common");
  const { branding } = useVendorBranding();
  const portalTitle = branding?.isCustom ? branding.displayName : t("portalTitle");

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--letmesee-sidebar-border)] px-4 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <VendorBrandLogo className="h-[2.475rem] w-auto shrink-0" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--letmesee-foreground)]">
            {portalTitle}
          </p>
          {!branding?.isCustom ? (
            <p className="truncate text-[11px] text-[var(--letmesee-muted)]">
              {t("portalSubtitle")}
            </p>
          ) : null}
        </div>
      </div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface)] hover:text-[var(--letmesee-foreground)] lg:hidden"
          aria-label={t("closeMenu")}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function VendorLayout() {
  return (
    <RequestCreditModalProvider>
      <VendorLayoutInner />
    </RequestCreditModalProvider>
  );
}

function VendorLayoutInner() {
  const { signOut } = useVendorAuth();
  const { branding } = useVendorBranding();
  const location = useLocation();
  const { t } = useTranslation("common");
  const { openRequestCredit } = useRequestCreditModal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const quickSearch = useVendorQuickSearch();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleSignOut() {
    setMobileOpen(false);
    signOut();
  }

  function handleMobileAction(handler: VendorMobileActionHandler) {
    if (handler === "request-credit") {
      openRequestCredit();
    }
  }

  const sidebar = (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SidebarBrand onClose={() => setMobileOpen(false)} />
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </div>
      </div>
      <SidebarFooter onSignOut={handleSignOut} />
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--letmesee-background)]">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] dark:bg-black/40 lg:hidden"
          aria-label={t("closeMenu")}
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen max-h-screen w-[min(280px,88vw)] flex-col border-r border-[var(--letmesee-sidebar-border)] bg-[var(--letmesee-sidebar)] backdrop-blur-md transition-transform duration-200 ease-out",
          "lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-64 lg:shrink-0 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--letmesee-border)] bg-[var(--letmesee-surface)]/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface-subtle)]"
            aria-label={t("openMenu")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <VendorBrandLogo className="h-[2.2rem] w-auto" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--letmesee-foreground)]">
            {branding?.isCustom ? branding.displayName : t("portalMobileTitle")}
          </span>
          <VendorQuickSearchTrigger openSearch={quickSearch.openSearch} />
        </header>

        <header className="sticky top-0 z-30 hidden items-center justify-end gap-3 border-b border-[var(--letmesee-border)] bg-[var(--letmesee-surface)]/90 px-6 py-3 backdrop-blur-md lg:flex">
          <RequestCreditTriggerButton labelKey="newRequestShort" />
          <VendorQuickSearchTrigger openSearch={quickSearch.openSearch} />
        </header>

        <main className="flex-1 overflow-auto p-4 pb-[calc(3.5rem+env(safe-area-inset-bottom))] sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>

        <VendorMobileActionBar onAction={handleMobileAction} />
        <PwaInstallHint />
        <VendorQuickSearchDialog {...quickSearch} />
      </div>
    </div>
  );
}

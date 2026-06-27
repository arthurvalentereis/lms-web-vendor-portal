import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { VendorBrandLogo } from "@/components/VendorBrandLogo";
import { PortalPreferences } from "@/components/preferences";
import { PageMeta } from "@/components/PageMeta";
import { useVendorAuth } from "@/contexts/VendorAuthContext";
import { vendorPortalService } from "@/services/vendorPortalService";

export function VerifyMagicLinkPage() {
  const { t } = useTranslation(["auth", "common"]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useVendorAuth();
  const [message, setMessage] = useState(t("verify.validating"));

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setMessage(t("verify.invalidLink"));
      toast.error(t("verify.invalidLink"));
      navigate("/login", { replace: true });
      return;
    }

    vendorPortalService
      .verifyMagicLink(token)
      .then((response) => {
        signIn(response);
        navigate("/dashboard", { replace: true });
      })
      .catch(() => {
        setMessage(t("verify.validationFailed"));
        toast.error(t("verify.invalidOrExpired"));
        navigate("/login", { replace: true });
      });
  }, [navigate, searchParams, signIn, t]);

  return (
    <div className="portal-auth-grid relative flex min-h-screen items-center justify-center px-4 py-10 pt-16 sm:pt-10">
      <PageMeta
        title={t("common:seo.verifyTitle")}
        description={t("common:seo.verifyDescription")}
        noIndex
        path="/auth/verify"
      />
      <PortalPreferences variant="floating" />

      <div className="portal-glow w-full max-w-md rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-10 text-center">
        <VendorBrandLogo className="mx-auto mb-6 h-[3.025rem] w-auto" />
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[var(--letmesee-purple)]" />
        <h1 className="text-xl font-semibold text-[var(--letmesee-foreground)]">
          {t("verify.title")}
        </h1>
        <p className="mt-2 text-sm text-[var(--letmesee-muted)]">{message}</p>
      </div>
    </div>
  );
}

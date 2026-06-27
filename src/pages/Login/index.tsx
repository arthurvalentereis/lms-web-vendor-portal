import { ArrowRight, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Trans, useTranslation } from "react-i18next";
import { PortalPreferences } from "@/components/preferences";
import { PageMeta } from "@/components/PageMeta";
import { VendorBrandLogo } from "@/components/VendorBrandLogo";
import { usePortalPageMeta } from "@/hooks/usePortalPageMeta";
import { vendorPortalService } from "@/services/vendorPortalService";

export function LoginPage() {
  const { t } = useTranslation(["auth", "common"]);
  const { siteName, buildTitle } = usePortalPageMeta();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const featureKeys = [
    "login.features.portfolio",
    "login.features.magicLink",
    "login.features.corporate",
  ] as const;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      toast.error(t("login.emailRequired"));
      return;
    }

    try {
      setLoading(true);
      await vendorPortalService.requestMagicLink(email.trim());
      setSent(true);
      toast.success(t("login.linkSent"));
    } catch {
      setSent(true);
      toast.success(t("login.linkSent"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen pt-12 sm:pt-0">
      <PageMeta
        title={buildTitle(t("common:seo.loginTitle"))}
        description={t("common:seo.loginDescription")}
        path="/login"
        siteName={siteName}
      />
      <PortalPreferences variant="floating" />

      <aside className="portal-brand-panel relative hidden w-[44%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[var(--letmesee-pink)]/20 blur-3xl" />
        <div className="absolute bottom-10 right-0 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 p-10 xl:p-14">
          <VendorBrandLogo avatar inverted />
        </div>

        <div className="relative z-10 space-y-6 px-10 pb-16 xl:px-14 xl:pb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            {t("login.badge")}
          </div>
          <h1 className="max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
            {t("login.headline")}
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/80">
            {t("login.description")}
          </p>

          <div className="grid max-w-md gap-3 pt-2">
            {featureKeys.map((key) => (
              <div
                key={key}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur-sm"
              >
                <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--letmesee-purple-light)]" />
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="portal-auth-grid flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="portal-glow w-full max-w-md rounded-2xl border border-[var(--letmesee-border)] bg-[var(--letmesee-surface)] p-8 sm:p-10">
          <div className="mb-8 text-center lg:hidden">
            <VendorBrandLogo avatar featuredSurface="surface" className="mx-auto" />
          </div>

          <div className="mb-8 space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--letmesee-purple)]">
              {t("login.accessTitle")}
            </p>
            <h2 className="text-2xl font-bold text-[var(--letmesee-foreground)]">
              {t("login.welcome")}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--letmesee-muted)]">
              {t("login.instructions")}
            </p>
          </div>

          {sent ? (
            <div className="rounded-xl border border-[var(--letmesee-purple)]/20 bg-[var(--letmesee-purple)]/5 px-4 py-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]">
                <Mail className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-[var(--letmesee-foreground)]">
                {t("login.checkInbox")}
              </p>
              <p className="mt-2 text-sm text-[var(--letmesee-muted)]">
                {t("login.sentMessage")}
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-[var(--letmesee-purple)] hover:underline"
              >
                {t("login.sendAgain")}
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[var(--letmesee-foreground)]"
                >
                  {t("login.emailLabel")}
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--letmesee-muted)]" />
                  <input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    className="flex h-11 w-full rounded-xl border border-[var(--letmesee-border)] bg-[var(--letmesee-input-bg)] pl-10 pr-3 text-sm text-[var(--letmesee-foreground)] outline-none transition focus:border-[var(--letmesee-purple)] focus:bg-[var(--letmesee-surface)] focus:ring-2 focus:ring-[var(--letmesee-purple)]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--letmesee-purple-dark)] to-[var(--letmesee-purple)] text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? t("login.submitting") : t("login.submit")}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs leading-relaxed text-[var(--letmesee-muted)]">
            <Trans
              i18nKey="login.footer"
              ns="auth"
              components={{ strong: <span className="font-semibold text-[var(--letmesee-purple)]" /> }}
            />
          </p>
        </div>
      </main>
    </div>
  );
}

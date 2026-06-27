import { useEffect, useRef, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "vendor-pwa-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isIosDevice() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true)
  );
}

export function PwaInstallHint() {
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandaloneMode()) return;
    if (localStorage.getItem(DISMISS_KEY) === "true") return;

    setIsIos(isIosDevice());

    function handleBeforeInstall(event: Event) {
      event.preventDefault();
      deferredPrompt.current = event as BeforeInstallPromptEvent;
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (isIosDevice()) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setVisible(false);
  }

  async function handleInstall() {
    const prompt = deferredPrompt.current;
    if (!prompt) return;

    await prompt.prompt();
    await prompt.userChoice;
    deferredPrompt.current = null;
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-4 z-50 mx-auto max-w-md rounded-xl border border-[var(--letmesee-border)]",
        "bg-[var(--letmesee-surface)] p-4 shadow-lg backdrop-blur-md",
        "bottom-[calc(3.75rem+env(safe-area-inset-bottom))] lg:hidden"
      )}
      role="region"
      aria-label={t("pwa.installHintTitle")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--letmesee-purple)]/10 text-[var(--letmesee-purple)]">
          {isIos ? <Share className="h-4 w-4" /> : <Download className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--letmesee-foreground)]">
            {t("pwa.installHintTitle")}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--letmesee-muted)]">
            {isIos ? t("pwa.installHintIos") : t("pwa.installHint")}
          </p>
          {!isIos ? (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--letmesee-purple)] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Download className="h-3.5 w-3.5" />
              {t("pwa.installAction")}
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--letmesee-muted)] transition-colors hover:bg-[var(--letmesee-surface-subtle)] hover:text-[var(--letmesee-foreground)]"
          aria-label={t("pwa.dismissInstallHint")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

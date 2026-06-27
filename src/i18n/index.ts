import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/common.json";
import authEn from "./locales/en/auth.json";
import dashboardEn from "./locales/en/dashboard.json";
import commonEs from "./locales/es/common.json";
import authEs from "./locales/es/auth.json";
import dashboardEs from "./locales/es/dashboard.json";
import commonPt from "./locales/pt-BR/common.json";
import authPt from "./locales/pt-BR/auth.json";
import dashboardPt from "./locales/pt-BR/dashboard.json";

export const SUPPORTED_LANGUAGES = ["pt-BR", "en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      "pt-BR": {
        common: commonPt,
        auth: authPt,
        dashboard: dashboardPt,
      },
      en: {
        common: commonEn,
        auth: authEn,
        dashboard: dashboardEn,
      },
      es: {
        common: commonEs,
        auth: authEs,
        dashboard: dashboardEs,
      },
    },
    fallbackLng: "pt-BR",
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultNS: "common",
    ns: ["common", "auth", "dashboard"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "vendor-portal-language",
      caches: ["localStorage"],
    },
  })
  .then(() => {
    syncDocumentLanguage(i18n.language);
  });

i18n.on("languageChanged", syncDocumentLanguage);

export function getActiveLocale(): SupportedLanguage {
  const language = i18n.language;
  if (language.startsWith("pt")) return "pt-BR";
  if (language.startsWith("es")) return "es";
  if (language.startsWith("en")) return "en";
  return "pt-BR";
}

export default i18n;

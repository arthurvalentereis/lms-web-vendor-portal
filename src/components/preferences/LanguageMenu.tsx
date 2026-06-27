import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PreferenceMenu } from "@/components/preferences/PreferenceMenu";
import {
  getActiveLocale,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/i18n";

interface LanguageMenuProps {
  menuPlacement?: "above" | "below";
  menuAlign?: "left" | "right";
}

export function LanguageMenu({
  menuPlacement = "below",
  menuAlign = "right",
}: LanguageMenuProps) {
  const { i18n, t } = useTranslation("common");

  const currentLanguage = getActiveLocale();

  const options = SUPPORTED_LANGUAGES.map((language) => ({
    value: language,
    label:
      language === "pt-BR"
        ? t("language.ptBR")
        : language === "en"
          ? t("language.en")
          : t("language.es"),
  }));

  return (
    <PreferenceMenu
      ariaLabel={t("language.label")}
      value={currentLanguage}
      options={options}
      onChange={(language: SupportedLanguage) => {
        void i18n.changeLanguage(language);
      }}
      trigger={<Languages className="h-4 w-4" />}
      placement={menuPlacement}
      align={menuAlign}
    />
  );
}

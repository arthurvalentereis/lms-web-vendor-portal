import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PreferenceMenu } from "@/components/preferences/PreferenceMenu";

type ThemeValue = "system" | "light" | "dark";

interface ThemeMenuProps {
  menuPlacement?: "above" | "below";
  menuAlign?: "left" | "right";
}

export function ThemeMenu({
  menuPlacement = "below",
  menuAlign = "left",
}: ThemeMenuProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { t } = useTranslation("common");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = (theme ?? "system") as ThemeValue;

  const triggerIcon = useMemo(() => {
    if (!mounted) return <Monitor className="h-4 w-4" />;
    if (currentTheme === "light") return <Sun className="h-4 w-4" />;
    if (currentTheme === "dark") return <Moon className="h-4 w-4" />;
    return resolvedTheme === "dark" ? (
      <Monitor className="h-4 w-4" />
    ) : (
      <Monitor className="h-4 w-4" />
    );
  }, [mounted, currentTheme, resolvedTheme]);

  const options = [
    {
      value: "system" as const,
      label: t("theme.system"),
      icon: <Monitor className="h-3.5 w-3.5" />,
    },
    {
      value: "light" as const,
      label: t("theme.light"),
      icon: <Sun className="h-3.5 w-3.5" />,
    },
    {
      value: "dark" as const,
      label: t("theme.dark"),
      icon: <Moon className="h-3.5 w-3.5" />,
    },
  ];

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label={t("theme.label")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--letmesee-muted)]"
      >
        <Monitor className="h-4 w-4" />
      </button>
    );
  }

  return (
    <PreferenceMenu
      ariaLabel={t("theme.label")}
      value={currentTheme}
      options={options}
      onChange={setTheme}
      trigger={triggerIcon}
      placement={menuPlacement}
      align={menuAlign}
    />
  );
}

import { Toaster } from "react-hot-toast";

export function ThemeAwareToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className:
          "!bg-[var(--letmesee-surface)] !text-[var(--letmesee-foreground)] !border !border-[var(--letmesee-border)]",
      }}
    />
  );
}

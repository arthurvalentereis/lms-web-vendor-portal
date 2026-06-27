/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API: string;
  readonly VITE_APP_PORTAL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

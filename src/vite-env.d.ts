/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API: string;
  readonly VITE_APP_PORTAL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

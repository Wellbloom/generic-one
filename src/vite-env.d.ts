/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_BASE_URL: string;
  readonly VITE_DEV_MODE: string;
  readonly VITE_API_TIMEOUT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

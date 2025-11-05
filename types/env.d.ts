declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    DIRECT_URL?: string; // Optional direct connection for migrations (Neon)
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
  }
}

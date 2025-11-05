declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    OPENAI_API_KEY?: string;
    AI_PROVIDER?: "ollama" | "openai";
  }
}

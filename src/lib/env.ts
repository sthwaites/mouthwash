// Type definition for the window object to include the env property
declare global {
  interface Window {
    env?: {
      OPENAI_API_KEY?: string;
    };
  }
}

/**
 * Retrieves the OpenAI API Key from environment variables.
 * Checks both runtime injected variables (window.env) and build-time variables (VITE_).
 * 
 * Priority:
 * 1. Runtime environment variable (window.env.OPENAI_API_KEY) - for Docker/Runtime
 * 2. Build-time environment variable (VITE_OPENAI_API_KEY) - for Local Dev
 */
export function getEnvApiKey(): string | undefined {
  // Check for runtime environment variable (injected via window.env)
  if (typeof window !== "undefined" && window.env?.OPENAI_API_KEY) {
    return window.env.OPENAI_API_KEY;
  }

  // Check for build-time environment variable
  if (import.meta.env.VITE_OPENAI_API_KEY) {
    return import.meta.env.VITE_OPENAI_API_KEY;
  }

  return undefined;
}

/**
 * Checks if an API Key is provided via environment variables.
 */
export function isEnvKeyPresent(): boolean {
  return !!getEnvApiKey();
}

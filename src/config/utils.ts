import { Environment } from "./types";

export const currentEnv = (process.env.NODE_ENV ||
  "development") as Environment;

export const isProductionEnv = currentEnv === Environment.Production;

export const isTestEnv = currentEnv === Environment.Test;

export const isStagingEnv = currentEnv === Environment.Staging;

export const isDevEnv = currentEnv === Environment.Development;

// When we deploy to production, we can whitelist the frontend domain or IP. Set CORS_WHITE_LIST value at .env file as example
// CORS_WHITE_LIST=http://example1.com,http://example2.com,http://example3.com,http://localhost:4200
export const corsWhitelist =
  process.env.CORS_WHITE_LIST ||
  "http://example1.com,http://example2.com,http://example3.com,http://localhost:4200";

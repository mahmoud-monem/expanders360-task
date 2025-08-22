import { config as envConfig } from 'dotenv';
import { expand } from 'dotenv-expand';
import { existsSync } from 'node:fs';
import { Environment } from '../constants/environment.enum';

let config: Record<string, string | undefined> | null = null;

/**
 * Loads dotenv variables based on current NODE_ENV
 */
export function getEnv(reload = false): Record<string, string | undefined> {
  if (config && !reload) {
    return config;
  }

  const path = getEnvFileName();

  if (path) {
    // Warn developer about env variable in use

    console.log(`📋 Using env file ${path}`);

    const loadedEnv = envConfig({ path });

    expand(loadedEnv);
  }

  config = process.env;
  return config;
}

/**
 * Gets env file name based on NODE_ENV variable
 */
function getEnvFileName(): string | undefined {
  switch (process.env.NODE_ENV) {
    case Environment.Test:
      return '.env.test';
    case Environment.Production:
      return undefined;
    default: {
      // For local env using untracked `.env` file
      if (existsSync('.env')) {
        return '.env';
      }
      return '.env.development';
    }
  }
}

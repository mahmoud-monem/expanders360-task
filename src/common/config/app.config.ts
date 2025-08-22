import { validateConfig } from '../utils/validate-config';
import { EnvironmentVariables } from './env-variables';
import { getEnv } from './get-env';

const env = getEnv();

/**
 * App config represents the list of env vars shared by both applications
 * The app config can be used in libs, scripts or other parts common for both apps
 */
const appConfig = validateConfig(env, EnvironmentVariables);

export { appConfig };

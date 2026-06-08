export function validateEnv(config: Record<string, unknown>) {
  if (!config.DATABASE_URL || typeof config.DATABASE_URL !== 'string') {
    throw new Error('DATABASE_URL is required');
  }

  if (config.PORT !== undefined && Number.isNaN(Number(config.PORT))) {
    throw new Error('PORT must be a valid number');
  }

  return config;
}

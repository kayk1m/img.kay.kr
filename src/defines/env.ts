const ENVIRONMENT_VARIABLES = ['JWT_SECRET', 'HASHIDS_KEY', 'MONGODB_URI', 'MONGODB_NAME'] as const;

export type EnvironmentVariable = typeof ENVIRONMENT_VARIABLES[number];

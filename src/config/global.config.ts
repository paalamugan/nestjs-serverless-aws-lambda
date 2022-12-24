export const globalConfig = () => ({
  env: process.env.NODE_ENV || 'dev',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});

export type GlobalConfigType = ReturnType<typeof globalConfig>;

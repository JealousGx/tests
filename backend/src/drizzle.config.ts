import { Config, defineConfig } from 'drizzle-kit';

import configuration from 'src/config/configuration';

const config = configuration();

export default defineConfig({
  out: './drizzle',
  schema: './src/common/schema/*',
  dialect: 'postgresql',
  dbCredentials: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database,
    ssl: false,
  } as any,
  strict: true,
}) satisfies Config;

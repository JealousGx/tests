import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import configuration from './configuration';

const config = configuration();

console.log(config);

const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
});

export const db = drizzle(pool);

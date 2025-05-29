import type { Config } from 'drizzle-kit';

if (!process.env.DB_CONN) {
  throw new Error('DB_CONN environment variable is required');
}

// Parse database URL for Neon connection
const dbUrl = new URL(process.env.DB_CONN);

export default {
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.substring(1),
    ssl: true,
  },
} satisfies Config; 
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema';

if (!process.env.DB_CONN) {
  throw new Error('DB_CONN environment variable is required');
}

const sql = neon(process.env.DB_CONN!);
export const db = drizzle(sql, { schema });

// Helper function to get user by email
export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);
  return user;
}

// Example of a type-safe query with Drizzle
export async function getBasicInfo(userEmail: string) {
  const [info] = await db
    .select()
    .from(schema.basicInfo)
    .where(eq(schema.basicInfo.userEmail, userEmail))
    .limit(1);
  return info;
}

// Export tables for type safety
export * from './schema'; 
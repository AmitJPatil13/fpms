import "server-only";
import { neon } from "@neondatabase/serverless";
export const sql = neon(process.env.DB_CONN!);

export async function verifyOwnership(
  userId: string,
  tableName: string,
  recordId: string
) {
  const result = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM ${tableName} t
        JOIN faculty f ON t.faculty_id = f.faculty_id
        WHERE f.user_id = ${userId}
        AND t.${tableName + "_id"} = ${recordId}
      ) as exists
    `;
  return result[0].exists;
}

export async function getFacultyId(userId: string) {
  const faculty = await sql`
      SELECT faculty_id FROM faculty WHERE user_id = ${userId}
    `;
  return faculty[0]?.faculty_id;
}

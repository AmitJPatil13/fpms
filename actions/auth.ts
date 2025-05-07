"use server";
import { sql } from "@/lib/db";

export async function createUser(email: string, name: string) {
  try {
    await sql`insert into users (email, name) values (${email}, ${name})`;
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to create user" };
  }
  return { success: true, message: "User created successfully" };
}

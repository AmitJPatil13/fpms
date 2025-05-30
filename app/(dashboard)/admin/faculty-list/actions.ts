'use server'

import { db } from "@/db";
import { users, basicInfo } from "@/db/schema";
import { eq, and, not } from "drizzle-orm";
import { getSession } from "redshield";

export async function getFacultyList() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return { error: 'Unauthorized' };
    }

    const facultyList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        department: basicInfo.department,
        designation: basicInfo.designation,
        isHod: basicInfo.isHod,
        bio: basicInfo.bio,
        createdAt: users.createdAt,
      })
      .from(users)
      .leftJoin(basicInfo, eq(users.email, basicInfo.userEmail))
      .where(not(eq(users.email, session.data.email))); // Exclude current admin

    return { data: facultyList };
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    return { error: 'Failed to fetch faculty list' };
  }
} 
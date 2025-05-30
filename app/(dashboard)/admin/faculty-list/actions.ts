'use server'

import { db } from "@/db";
import { users, basicInfo } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFacultyList() {
  try {
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
      .leftJoin(basicInfo, eq(users.email, basicInfo.userEmail));

    return { data: facultyList };
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    return { error: 'Failed to fetch faculty list' };
  }
} 
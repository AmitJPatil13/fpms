import { NextResponse } from 'next/server';
import { db } from '@/db';
import { teachingActivities } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/teaching-activities
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const activities = await db.query.teachingActivities.findMany({
      where: eq(teachingActivities.userEmail, session.data.email),
      orderBy: (activities, { desc }) => [desc(activities.createdAt)],
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('Failed to fetch teaching activities:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch teaching activities' },
      { status: 500 }
    );
  }
}

// POST /api/teaching-activities
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      academicYear,
      subjectName,
      lectureHours,
      tutorialHours,
      practicalHours,
      extraHours,
    } = body;

    // Validate required fields
    if (!academicYear || !subjectName || lectureHours === undefined || tutorialHours === undefined || practicalHours === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate hours (must be non-negative)
    if (lectureHours < 0 || tutorialHours < 0 || practicalHours < 0 || extraHours < 0) {
      return NextResponse.json(
        { success: false, message: 'Hours cannot be negative' },
        { status: 400 }
      );
    }

    const [activity] = await db.insert(teachingActivities)
      .values({
        userEmail: session.data.email,
        academicYear,
        subjectName,
        lectureHours,
        tutorialHours,
        practicalHours,
        extraHours: extraHours || 0,
      })
      .returning();

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Failed to create teaching activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create teaching activity' },
      { status: 500 }
    );
  }
} 
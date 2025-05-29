import { NextResponse } from 'next/server';
import { db } from '@/db';
import { coCurricularActivities } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/co-curricular-activities
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const activities = await db.query.coCurricularActivities.findMany({
      where: eq(coCurricularActivities.userEmail, session.data.email),
      orderBy: (activities, { desc }) => [desc(activities.academicYear), desc(activities.createdAt)],
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('Failed to fetch co-curricular activities:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/co-curricular-activities
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      academicYear,
      activityType,
      hoursSpent,
      level,
    } = body;

    // Validate required fields
    if (!academicYear || !activityType || !level) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate hours spent
    if (hoursSpent !== undefined && hoursSpent < 0) {
      return NextResponse.json(
        { success: false, message: 'Hours spent cannot be negative' },
        { status: 400 }
      );
    }

    const [activity] = await db.insert(coCurricularActivities)
      .values({
        userEmail: session.data.email,
        academicYear,
        activityType,
        hoursSpent: hoursSpent || 0,
        level,
      })
      .returning();

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Failed to create co-curricular activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 
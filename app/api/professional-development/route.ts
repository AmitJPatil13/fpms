import { NextResponse } from 'next/server';
import { db } from '@/db';
import { professionalDevelopment } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/professional-development
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const activities = await db.query.professionalDevelopment.findMany({
      where: eq(professionalDevelopment.userEmail, session.data.email),
      orderBy: (activities, { desc }) => [desc(activities.dateFrom), desc(activities.createdAt)],
    });

    return NextResponse.json({ success: true, activities });
  } catch (error) {
    console.error('Failed to fetch professional development activities:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// POST /api/professional-development
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      academicYear,
      eventType,
      eventTitle,
      durationDays,
      dateFrom,
      dateTo,
      organizedBy,
    } = body;

    // Validate required fields
    if (!academicYear || !eventType || !eventTitle || !durationDays || !dateFrom || !dateTo || !organizedBy) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    if (toDate < fromDate) {
      return NextResponse.json(
        { success: false, message: 'End date cannot be earlier than start date' },
        { status: 400 }
      );
    }

    // Validate duration
    if (durationDays <= 0) {
      return NextResponse.json(
        { success: false, message: 'Duration must be positive' },
        { status: 400 }
      );
    }

    const [activity] = await db.insert(professionalDevelopment)
      .values({
        userEmail: session.data.email,
        academicYear,
        eventType,
        eventTitle,
        durationDays,
        dateFrom,
        dateTo,
        organizedBy,
      })
      .returning();

    return NextResponse.json({ success: true, activity });
  } catch (error) {
    console.error('Failed to create professional development activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create activity' },
      { status: 500 }
    );
  }
}

// Helper function to validate URLs
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
} 
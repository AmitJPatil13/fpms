import { NextResponse } from 'next/server';
import { db } from '@/db';
import { examDuties } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/exam-duties
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const duties = await db.query.examDuties.findMany({
      where: eq(examDuties.userEmail, session.data.email),
      orderBy: (duties, { desc }) => [desc(duties.dutyDate), desc(duties.createdAt)],
    });

    return NextResponse.json({ success: true, duties });
  } catch (error) {
    console.error('Failed to fetch exam duties:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch duties' },
      { status: 500 }
    );
  }
}

// POST /api/exam-duties
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      academicYear,
      dutyType,
      dutyDate,
      hoursSpent,
    } = body;

    // Validate required fields
    if (!academicYear || !dutyType || !dutyDate) {
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

    // Validate duty date
    const examDate = new Date(dutyDate);
    const currentDate = new Date();
    if (examDate > currentDate) {
      return NextResponse.json(
        { success: false, message: 'Duty date cannot be in the future' },
        { status: 400 }
      );
    }

    const [duty] = await db.insert(examDuties)
      .values({
        userEmail: session.data.email,
        academicYear,
        dutyType,
        dutyDate,
        hoursSpent: hoursSpent || 0,
      })
      .returning();

    return NextResponse.json({ success: true, duty });
  } catch (error) {
    console.error('Failed to create exam duty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create duty' },
      { status: 500 }
    );
  }
} 
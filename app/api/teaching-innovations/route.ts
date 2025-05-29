import { NextResponse } from 'next/server';
import { db } from '@/db';
import { teachingInnovations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/teaching-innovations
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const innovations = await db.query.teachingInnovations.findMany({
      where: eq(teachingInnovations.userEmail, session.data.email),
      orderBy: (innovations, { desc }) => [desc(innovations.academicYear), desc(innovations.createdAt)],
    });

    return NextResponse.json({ success: true, innovations });
  } catch (error) {
    console.error('Failed to fetch teaching innovations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch teaching innovations' },
      { status: 500 }
    );
  }
}

// POST /api/teaching-innovations
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      academicYear,
      description,
      hoursSpent,
      toolUsed,
    } = body;

    // Validate required fields
    if (!academicYear || !description || !toolUsed) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate hours spent
    if (hoursSpent !== undefined && hoursSpent < 0) {
      return NextResponse.json(
        { success: false, message: 'Hours spent must be non-negative' },
        { status: 400 }
      );
    }

    const [innovation] = await db.insert(teachingInnovations)
      .values({
        userEmail: session.data.email,
        academicYear,
        description,
        hoursSpent: hoursSpent || 0,
        toolUsed,
      })
      .returning();

    return NextResponse.json({ success: true, innovation });
  } catch (error) {
    console.error('Failed to create teaching innovation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create teaching innovation' },
      { status: 500 }
    );
  }
} 
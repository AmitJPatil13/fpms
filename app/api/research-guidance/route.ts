import { NextResponse } from 'next/server';
import { db } from '@/db';
import { researchGuidance } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/research-guidance
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const guidances = await db.query.researchGuidance.findMany({
      where: eq(researchGuidance.userEmail, session.data.email),
      orderBy: (guidance, { desc }) => [desc(guidance.year), desc(guidance.createdAt)],
    });

    return NextResponse.json({ success: true, guidances });
  } catch (error) {
    console.error('Failed to fetch research guidances:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch research guidances' },
      { status: 500 }
    );
  }
}

// POST /api/research-guidance
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      scholarName,
      degree,
      status,
      year,
    } = body;

    // Validate required fields
    if (!scholarName || !degree || !status || !year) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return NextResponse.json(
        { success: false, message: 'Invalid year' },
        { status: 400 }
      );
    }

    const [guidance] = await db.insert(researchGuidance)
      .values({
        userEmail: session.data.email,
        scholarName,
        degree,
        status,
        year,
      })
      .returning();

    return NextResponse.json({ success: true, guidance });
  } catch (error) {
    console.error('Failed to create research guidance:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create research guidance' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { awards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/awards
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userAwards = await db.query.awards.findMany({
      where: eq(awards.userEmail, session.data.email),
      orderBy: (awards, { desc }) => [desc(awards.date), desc(awards.createdAt)],
    });

    return NextResponse.json({ success: true, awards: userAwards });
  } catch (error) {
    console.error('Failed to fetch awards:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch awards' },
      { status: 500 }
    );
  }
}

// POST /api/awards
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      entryType,
      level,
      date,
    } = body;

    // Validate required fields
    if (!title || !entryType || !level || !date) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate string lengths
    if (title.length > 255) {
      return NextResponse.json(
        { success: false, message: 'Title too long (max 255 characters)' },
        { status: 400 }
      );
    }

    if (entryType.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Entry type too long (max 50 characters)' },
        { status: 400 }
      );
    }

    if (level.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Level too long (max 50 characters)' },
        { status: 400 }
      );
    }

    // Validate date
    const awardDate = new Date(date);
    const currentDate = new Date();
    if (isNaN(awardDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid date format' },
        { status: 400 }
      );
    }

    if (awardDate > currentDate) {
      return NextResponse.json(
        { success: false, message: 'Award date cannot be in the future' },
        { status: 400 }
      );
    }

    const [award] = await db.insert(awards)
      .values({
        //@ts-ignore
        userEmail: session.data.email,
        title,
        entryType,
        level,
        date: awardDate.toISOString().split('T')[0],
      })
      .returning();

    return NextResponse.json({ success: true, award });
  } catch (error) {
    console.error('Failed to create award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create award' },
      { status: 500 }
    );
  }
}

// DELETE /api/awards/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid award ID' },
        { status: 400 }
      );
    }

    await db.delete(awards).where(
      and(
        eq(awards.id, id),
        eq(awards.userEmail, session.data.email)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete award' },
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
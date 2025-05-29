import { NextResponse } from 'next/server';
import { db } from '@/db';
import { researchPublications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/research-publications
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const publications = await db.query.researchPublications.findMany({
      where: eq(researchPublications.userEmail, session.data.email),
      orderBy: (publications, { desc }) => [desc(publications.datePublished), desc(publications.createdAt)],
    });

    return NextResponse.json({ success: true, publications });
  } catch (error) {
    console.error('Failed to fetch research publications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch research publications' },
      { status: 500 }
    );
  }
}

// POST /api/research-publications
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      publicationType,
      journalName,
      issnIsbn,
      impactFactor,
      datePublished,
      level,
    } = body;

    // Validate required fields
    if (!title || !publicationType || !journalName || !datePublished || !level) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate impact factor if provided
    if (impactFactor !== undefined && impactFactor < 0) {
      return NextResponse.json(
        { success: false, message: 'Impact factor must be non-negative' },
        { status: 400 }
      );
    }

    // Validate date published
    const publishedDate = new Date(datePublished);
    const currentDate = new Date();
    if (publishedDate > currentDate) {
      return NextResponse.json(
        { success: false, message: 'Publication date cannot be in the future' },
        { status: 400 }
      );
    }

    const [publication] = await db.insert(researchPublications)
      .values({
        userEmail: session.data.email,
        title,
        publicationType,
        journalName,
        issnIsbn,
        impactFactor,
        datePublished,
        level,
      })
      .returning();

    return NextResponse.json({ success: true, publication });
  } catch (error) {
    console.error('Failed to create research publication:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create research publication' },
      { status: 500 }
    );
  }
} 
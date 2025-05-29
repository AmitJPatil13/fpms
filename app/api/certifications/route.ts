import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/certifications
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userCertifications = await db.query.certifications.findMany({
      where: eq(certifications.userEmail, session.data.email),
      orderBy: (certs, { desc }) => [desc(certs.createdAt)],
    });

    return NextResponse.json({ success: true, certifications: userCertifications });
  } catch (error) {
    console.error('Failed to fetch certifications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch certifications' },
      { status: 500 }
    );
  }
}

// POST /api/certifications
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      certTitle,
      domain,
      issuingOrganization,
      certType,
      dateIssued,
      durationHours,
      certImg,
    } = body;

    // Validate required fields
    if (!certTitle || !domain || !issuingOrganization || !certType || !dateIssued || !durationHours || !certImg) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!certImg.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, message: 'Invalid image format' },
        { status: 400 }
      );
    }

    const [certification] = await db.insert(certifications)
      .values({
        userEmail: session.data.email,
        certTitle,
        domain,
        issuingOrganization,
        certType,
        dateIssued,
        durationHours,
        certImg,
      })
      .returning();

    return NextResponse.json({ success: true, certification });
  } catch (error) {
    console.error('Failed to create certification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create certification' },
      { status: 500 }
    );
  }
} 
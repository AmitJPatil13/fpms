import { NextResponse } from 'next/server';
import { db } from '@/db';
import { basicInfo } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/basic-info
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const info = await db.query.basicInfo.findFirst({
      where: eq(basicInfo.userEmail, session.data.email),
    });

    return NextResponse.json({ success: true, basicInfo: info });
  } catch (error) {
    console.error('Failed to fetch basic info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch basic info' },
      { status: 500 }
    );
  }
}

// POST /api/basic-info
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { department, designation, isHod, bio } = body;

    // Validate required fields
    if (!department || !designation) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [info] = await db.insert(basicInfo)
      .values({
        userEmail: session.data.email,
        department,
        designation,
        isHod,
        bio,
      })
      .returning();

    return NextResponse.json({ success: true, basicInfo: info });
  } catch (error) {
    console.error('Failed to create basic info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create basic info' },
      { status: 500 }
    );
  }
}

// PUT /api/basic-info
export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { department, designation, isHod, bio } = body;

    // Validate required fields
    if (!department || !designation) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [info] = await db.update(basicInfo)
      .set({
        department,
        designation,
        isHod,
        bio,
      })
      .where(eq(basicInfo.userEmail, session.data.email))
      .returning();

    if (!info) {
      return NextResponse.json(
        { success: false, message: 'Basic info not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, basicInfo: info });
  } catch (error) {
    console.error('Failed to update basic info:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update basic info' },
      { status: 500 }
    );
  }
} 
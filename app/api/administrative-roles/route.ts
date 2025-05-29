import { NextResponse } from 'next/server';
import { db } from '@/db';
import { administrativeRoles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/administrative-roles
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const roles = await db.query.administrativeRoles.findMany({
      where: eq(administrativeRoles.userEmail, session.data.email),
      orderBy: (roles, { desc }) => [desc(roles.createdAt)],
    });

    return NextResponse.json({ success: true, roles });
  } catch (error) {
    console.error('Failed to fetch administrative roles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch administrative roles' },
      { status: 500 }
    );
  }
}

// POST /api/administrative-roles
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { academicYear, roleTitle, hoursSpent } = body;

    // Validate required fields
    if (!academicYear || !roleTitle || hoursSpent === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const [role] = await db.insert(administrativeRoles)
      .values({
        userEmail: session.data.email,
        academicYear,
        roleTitle,
        hoursSpent,
      })
      .returning();

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Failed to create administrative role:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create administrative role' },
      { status: 500 }
    );
  }
} 
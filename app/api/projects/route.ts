import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// GET /api/projects
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userEmail, session.data.email),
      orderBy: (projects, { desc }) => [desc(projects.dateStarted), desc(projects.createdAt)],
    });

    return NextResponse.json({ success: true, projects: userProjects });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.status || !session?.data?.email) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      projectTitle,
      projectType,
      fundingAgency,
      amountFunded,
      dateStarted,
      dateCompleted,
    } = body;

    // Validate required fields
    if (!projectTitle || !projectType || !fundingAgency || amountFunded === undefined || !dateStarted) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate amount format and range
    const amount = parseFloat(amountFunded);
    if (isNaN(amount) || amount < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Validate amount precision (12,2)
    const amountStr = amount.toString();
    const [whole, decimal] = amountStr.split('.');
    if (whole.length > 10 || (decimal && decimal.length > 2)) {
      return NextResponse.json(
        { success: false, message: 'Amount exceeds maximum precision (10 digits with 2 decimal places)' },
        { status: 400 }
      );
    }

    // Validate dates
    const startDate = new Date(dateStarted);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { success: false, message: 'Invalid start date' },
        { status: 400 }
      );
    }

    if (dateCompleted) {
      const completionDate = new Date(dateCompleted);
      if (isNaN(completionDate.getTime())) {
        return NextResponse.json(
          { success: false, message: 'Invalid completion date' },
          { status: 400 }
        );
      }

      if (completionDate < startDate) {
        return NextResponse.json(
          { success: false, message: 'Completion date cannot be earlier than start date' },
          { status: 400 }
        );
      }
    }

    // Validate string lengths
    if (fundingAgency.length > 255) {
      return NextResponse.json(
        { success: false, message: 'Funding agency name too long (max 255 characters)' },
        { status: 400 }
      );
    }

    if (projectType.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Project type too long (max 50 characters)' },
        { status: 400 }
      );
    }

    const [project] = await db.insert(projects).values({
      //@ts-ignore
      userEmail: session.data.email,
      projectTitle,
      projectType,
      fundingAgency,
      amountFunded: amount,
      dateStarted: startDate,
      dateCompleted: dateCompleted ? new Date(dateCompleted) : null,
    }).returning();

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id]
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
        { success: false, message: 'Invalid project ID' },
        { status: 400 }
      );
    }

    await db.delete(projects).where(
      and(
        eq(projects.id, id),
        eq(projects.userEmail, session.data.email)
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 
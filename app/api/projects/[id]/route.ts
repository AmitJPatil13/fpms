import { NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

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
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Delete the project and ensure it belongs to the current user
    const [deletedProject] = await db.delete(projects)
      .where(
        and(
          eq(projects.id, id),
          eq(projects.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedProject) {
      return NextResponse.json(
        { success: false, message: 'Project not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, project: deletedProject });
  } catch (error) {
    console.error('Failed to delete project:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 
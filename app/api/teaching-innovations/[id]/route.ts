import { NextResponse } from 'next/server';
import { db } from '@/db';
import { teachingInnovations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/teaching-innovations/[id]
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

    // Delete the innovation and ensure it belongs to the current user
    const [deletedInnovation] = await db.delete(teachingInnovations)
      .where(
        and(
          eq(teachingInnovations.id, id),
          eq(teachingInnovations.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedInnovation) {
      return NextResponse.json(
        { success: false, message: 'Teaching innovation not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, innovation: deletedInnovation });
  } catch (error) {
    console.error('Failed to delete teaching innovation:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete teaching innovation' },
      { status: 500 }
    );
  }
} 
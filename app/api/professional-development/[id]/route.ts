import { NextResponse } from 'next/server';
import { db } from '@/db';
import { professionalDevelopment } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/professional-development/[id]
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

    // Delete the activity and ensure it belongs to the current user
    const [deletedActivity] = await db.delete(professionalDevelopment)
      .where(
        and(
          eq(professionalDevelopment.id, id),
          eq(professionalDevelopment.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedActivity) {
      return NextResponse.json(
        { success: false, message: 'Activity not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, activity: deletedActivity });
  } catch (error) {
    console.error('Failed to delete professional development activity:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete activity' },
      { status: 500 }
    );
  }
} 
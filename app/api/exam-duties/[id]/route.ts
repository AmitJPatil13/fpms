import { NextResponse } from 'next/server';
import { db } from '@/db';
import { examDuties } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/exam-duties/[id]
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

    // Delete the duty and ensure it belongs to the current user
    const [deletedDuty] = await db.delete(examDuties)
      .where(
        and(
          eq(examDuties.id, id),
          eq(examDuties.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedDuty) {
      return NextResponse.json(
        { success: false, message: 'Duty not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, duty: deletedDuty });
  } catch (error) {
    console.error('Failed to delete exam duty:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete duty' },
      { status: 500 }
    );
  }
} 
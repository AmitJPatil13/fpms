import { NextResponse } from 'next/server';
import { db } from '@/db';
import { awards } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

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
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    // Delete the award and ensure it belongs to the current user
    const [deletedAward] = await db.delete(awards)
      .where(
        and(
          eq(awards.id, id),
          eq(awards.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedAward) {
      return NextResponse.json(
        { success: false, message: 'Award not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, award: deletedAward });
  } catch (error) {
    console.error('Failed to delete award:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete award' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { researchGuidance } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/research-guidance/[id]
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

    // Delete the guidance and ensure it belongs to the current user
    const [deletedGuidance] = await db.delete(researchGuidance)
      .where(
        and(
          eq(researchGuidance.id, id),
          eq(researchGuidance.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedGuidance) {
      return NextResponse.json(
        { success: false, message: 'Research guidance not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, guidance: deletedGuidance });
  } catch (error) {
    console.error('Failed to delete research guidance:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete research guidance' },
      { status: 500 }
    );
  }
} 
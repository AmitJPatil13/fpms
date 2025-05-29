import { NextResponse } from 'next/server';
import { db } from '@/db';
import { researchPublications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/research-publications/[id]
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

    // Delete the publication and ensure it belongs to the current user
    const [deletedPublication] = await db.delete(researchPublications)
      .where(
        and(
          eq(researchPublications.id, id),
          eq(researchPublications.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedPublication) {
      return NextResponse.json(
        { success: false, message: 'Research publication not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, publication: deletedPublication });
  } catch (error) {
    console.error('Failed to delete research publication:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete research publication' },
      { status: 500 }
    );
  }
} 
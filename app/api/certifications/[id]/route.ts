import { NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/certifications/[id]
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

    // Delete the certification and ensure it belongs to the current user
    const [deletedCertification] = await db.delete(certifications)
      .where(
        and(
          eq(certifications.id, id),
          eq(certifications.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedCertification) {
      return NextResponse.json(
        { success: false, message: 'Certification not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, certification: deletedCertification });
  } catch (error) {
    console.error('Failed to delete certification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete certification' },
      { status: 500 }
    );
  }
} 
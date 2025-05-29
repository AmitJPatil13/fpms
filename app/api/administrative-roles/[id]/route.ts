import { NextResponse } from 'next/server';
import { db } from '@/db';
import { administrativeRoles } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getSession } from 'redshield';

// DELETE /api/administrative-roles/[id]
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

    // Delete the role and ensure it belongs to the current user
    const [deletedRole] = await db.delete(administrativeRoles)
      .where(
        and(
          eq(administrativeRoles.id, id),
          eq(administrativeRoles.userEmail, session.data.email)
        )
      )
      .returning();

    if (!deletedRole) {
      return NextResponse.json(
        { success: false, message: 'Role not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, role: deletedRole });
  } catch (error) {
    console.error('Failed to delete administrative role:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete administrative role' },
      { status: 500 }
    );
  }
} 
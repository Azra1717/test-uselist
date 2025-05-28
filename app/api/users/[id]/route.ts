import { NextResponse } from "next/server";
import { db } from "../../../../db";
import { users, addresses } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { userSchema } from "@/lib/validations/userSchema";
import { z } from 'zod';
// import { NextResponse } from 'next/server';

const updateUserSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid birthdate format (YYYY-MM-DD)"),
  address: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    province: z.string().min(1),
    postalCode: z.string().min(1),
  }),
});

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // const { id } = context.params;
    // const userId = parseInt(id);
    const userId = parseInt(params.id);
    const user = await db
      .select({
        firstname: users.firstname,
        lastname: users.lastname,
        birthdate: users.birthdate,
        street: addresses.street,
        city: addresses.city,
        province: addresses.province,
        postal_code: addresses.postalCode,
      })
      .from(users)
      .innerJoin(addresses, eq(users.id, addresses.userId))
      .where(eq(users.id, userId));

    if (!user || user.length === 0) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json(user[0]);
  } catch (err) {
    console.error('get api error:', err);

    return NextResponse.json(
      { error: 'salah di server' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    const body = await req.json();
    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    await db
      .update(users)
      .set({
        firstname: data.firstname,
        lastname: data.lastname,
        birthdate: data.birthdate,
      })
      .where(eq(users.id, userId));

    await db
      .update(addresses)
      .set({
        street: data.address.street,
        city: data.address.city,
        province: data.address.province,
        postalCode: data.address.postalCode,
      })
      .where(eq(addresses.userId, userId));

    return NextResponse.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    console.error('PUT /api/users/[id] error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat update data' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    
    await db.delete(addresses).where(eq(addresses.userId, userId));

    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('DELETE /api/users/[id] error:', err);
    return NextResponse.json(
      { error: 'Ger' },
      { status: 500 }
    );
  }
}
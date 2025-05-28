import { NextResponse } from "next/server";
import { db } from "../../../db";
import { users, addresses } from "../../../db/schema";
import { eq, desc} from "drizzle-orm"; 
// import { userSchema } from "@/lib/validations/userSchema";
import { z } from 'zod';
// import { db } from '@/lib/db'; 
// import { users, addresses } from '@/lib/schema';
// import { desc } from 'drizzle-orm';

const createUserSchema = z.object({
  firstname: z.string().min(1, 'Firstname is required'),
  lastname: z.string().min(1, 'Lastname is required'),
  birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid birthdate format (YYYY-MM-DD)'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postalCode: z.string().min(1, 'Postal code must be at least 4 characters'),
  }),
});


export async function GET() {
  try {
    const result = await db
      .select()
      .from(users)
      .leftJoin(addresses, on => eq(addresses.userId, users.id)); 
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();    
    const parsed = createUserSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ errors: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = parsed.data;
    await db.insert(users).values({
      firstname: data.firstname,
      lastname: data.lastname,
      birthdate: new Date(data.birthdate),
    });

   
    const latestUser = await db
      .select({ id: users.id })
      .from(users)
      .orderBy(desc(users.id))
      .limit(1);

    const userId = latestUser[0]?.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Gagal mengambil ID user' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(addresses).values({
      userId,
      street: data.address.street,
      city: data.address.city,
      province: data.address.province,
      postalCode: data.address.postalCode,
    });

    return new Response(
      JSON.stringify({ message: 'User berhasil dibuat' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error', err);

    return new Response(
      JSON.stringify({ error: 'kesalahan ' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

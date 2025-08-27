import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { signupSchema } from "@/schemas/signupSchema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate with zod schema
    const data = signupSchema.parse(body);

    await dbConnect();

    // Check for existing email
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const password = await bcrypt.hash(data.password, 10);

    // Create user
    await User.create({
      fullName: data.fullName,
      email: data.email,
      image: data.image,
      password,
      role: "user",
    });

    return NextResponse.json({ success: true, message: "User created" });
  } catch (error: unknown) {
    console.error("Signup error:", error);

    // Type guard for ZodError
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return NextResponse.json(
        { error: zodError.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

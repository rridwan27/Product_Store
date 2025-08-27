// app/api/profile/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { z } from "zod";

export const runtime = "nodejs";

const patchSchema = z.object({
  fullName: z.string().min(2),
  image: z.string().url().optional().or(z.literal("")),
});

// GET current user profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    image: user.image ?? "",
    role: user.role ?? "user",
  });
}

// Update current user profile
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let data;
  try {
    const json = await req.json();
    data = patchSchema.parse(json);
  } catch (error: unknown) {
    let errorMessage = "Invalid payload";
    if (error && typeof error === "object" && "issues" in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      errorMessage = zodError.issues[0]?.message || errorMessage;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  await dbConnect();
  const updated = await User.findOneAndUpdate(
    { email: session.user.email },
    { fullName: data.fullName, image: data.image || undefined },
    { new: true, runValidators: true }
  ).lean();

  if (!updated)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: String(updated._id),
    fullName: updated.fullName,
    email: updated.email,
    image: updated.image ?? "",
    role: updated.role ?? "user",
  });
}

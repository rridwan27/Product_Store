// app/profile/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ProfileForm from "./profile-form";

export const runtime = "nodejs"; // using DB in the route below

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // Define the user type with all required properties
  type SessionUser = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role?: string;
  };

  // Type assertion for session user with required properties
  const sessionUser = session.user as SessionUser;

  // Minimal data to show on first render (client fetch refines later too)
  const user = {
    id: sessionUser.id,
    name: sessionUser.name ?? "",
    email: sessionUser.email ?? "",
    image: sessionUser.image ?? "",
    role: sessionUser.role ?? "user",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal information.
        </p>
      </header>

      <ProfileForm initialUser={user} />
    </div>
  );
}

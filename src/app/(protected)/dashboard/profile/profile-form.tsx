"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export default function ProfileForm({
  initialUser,
}: {
  initialUser: {
    id?: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
  };
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: initialUser.name ?? "",
      image: initialUser.image ?? "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to update profile");
      }
      router.refresh();
      alert("Profile updated!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border p-6"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border bg-muted">
          {initialUser.image ? (
            <Image
              src={initialUser.image}
              alt="avatar"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              {initialUser.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
        <div>
          <div className="text-sm font-medium">{initialUser.email}</div>
          <div className="text-xs text-muted-foreground">
            Role: {initialUser.role ?? "user"}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Full name</label>
        <input
          className="mt-1 w-full rounded-md border p-2"
          {...register("fullName")}
          placeholder="Your name"
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Avatar URL</label>
        <input
          className="mt-1 w-full rounded-md border p-2"
          {...register("image")}
          placeholder="https://example.com/avatar.jpg"
        />
        {errors.image && (
          <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || !isDirty}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        <Link
          href="/"
          className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

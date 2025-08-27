"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/signupSchema";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiImage,
} from "react-icons/fi";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

type SignupForm = z.infer<typeof signupSchema>;

const SignUp = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google">(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to sign up");

      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Signup successful! You can now sign in.",
      });
      router.push("/products");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
      Swal.fire({
        icon: "error",
        title: "Error...",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setSocialLoading("google");
    await signIn("google", { callbackUrl: "/products" });
    setSocialLoading(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500">
            Join us to get started with our services
          </p>
        </div>

        {/* Social login */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={!!socialLoading || loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
          >
            {socialLoading === "google" ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-gray-700"></div>
            ) : (
              <>
                <FcGoogle className="text-xl" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">or sign up with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        </div>

        {/* Email/password signup */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiUser />
              </div>
              <input
                type="text"
                {...register("fullName")}
                className="pl-10 mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiMail />
              </div>
              <input
                type="email"
                {...register("email")}
                className="pl-10 mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiLock />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="pl-10 pr-10 mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="********"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Image (URL)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FiImage />
              </div>
              <input
                type="text"
                {...register("image")}
                className="pl-10 mt-1 w-full rounded-xl border border-gray-300 p-2.5 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            {errors.image && (
              <p className="mt-1 text-sm text-red-500">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-6"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white mr-2"></div>
                Signing up...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

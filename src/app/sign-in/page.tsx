"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const signinSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SigninForm = z.infer<typeof signinSchema>;

const SignIn = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<null | "google">(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninForm) => {
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.ok) {
      router.push("/products");
      router.refresh();
    } else {
      alert(res?.error || "Invalid email or password");
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
            Welcome Back
          </h2>
          <p className="text-gray-500">Sign in to access your account</p>
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
            <span className="text-sm text-gray-400">or sign in with email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
        </div>

        {/* Credentials login */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Forgot password link */}
          <div className="text-right">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !!socialLoading}
            className="w-full cursor-pointer rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <FiLogIn className="text-lg" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;

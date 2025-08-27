import { z } from "zod";

export const signupSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  image: z.string().url("Image must be a valid URL").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
  role: z.enum(["admin", "user"]).default("user"),
});

export type SignupSchema = z.infer<typeof signupSchema>;

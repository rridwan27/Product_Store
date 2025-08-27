// import NextAuth, { DefaultSession, User as NextAuthUser } from "next-auth";
// import Google from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import dbConnect from "@/lib/dbConnect";
// import User, { User as UserType } from "@/models/user";
// import bcrypt from "bcryptjs";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id?: string;
//       role?: string;
//     } & DefaultSession["user"];
//   }
// }

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   secret: process.env.AUTH_SECRET,
//   session: { strategy: "jwt" },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         const email = String(credentials.email).toLowerCase().trim();
//         const password = String(credentials.password);

//         await dbConnect();

//         const user = await User.findOne({ email }).select<
//           Pick<
//             UserType,
//             "password" | "role" | "fullName" | "image" | "email" | "_id"
//           >
//         >("+password role fullName image email");

//         if (!user || !user.password) return null;

//         const valid = await bcrypt.compare(password, user.password);
//         if (!valid) return null;

//         return {
//           id: user._id.toString(),
//           email: user.email,
//           name: user.fullName,
//           image: user.image,
//           role: user.role,
//         };
//       },
//     }),

//     Google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//   ],

//   callbacks: {
//     async signIn({ user, account }) {
//       if (account?.provider === "google") {
//         await dbConnect();
//         const existing = await User.findOne({ email: user.email });
//         if (!existing) {
//           await User.create({
//             email: user.email,
//             fullName: user.name,
//             image: user.image,
//             role: "user",
//           });
//         }
//       }
//       return true;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role ?? token.role ?? "user";
//       }

//       if (!token.role && token.email) {
//         await dbConnect();
//         const dbUser = await User.findOne({ email: token.email })
//           .select("role")
//           .lean();
//         token.role = dbUser?.role ?? "user";
//       }

//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub || "";
//         session.user.role =
//           typeof token.role === "string" ? token.role : "user";
//       }
//       return session;
//     },

//     async redirect({ baseUrl }) {
//       return new URL("/products", baseUrl).toString();
//     },
//   },
// });

// auth.ts
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User, { User as UserType } from "@/models/user";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        await dbConnect();

        const user = await User.findOne({ email }).select<
          Pick<
            UserType,
            "password" | "role" | "fullName" | "image" | "email" | "_id"
          >
        >("+password role fullName image email");

        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // Return only the safe fields — these land in `user` param of `jwt()`
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          image: user.image,
          role: user.role,
        };
      },
    }),

    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await dbConnect();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            email: user.email,
            fullName: user.name,
            image: user.image,
            role: "user",
          });
        }
      }
      return true;
    },

    // ⬇️ Make sure all fields are on the token for BOTH providers
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id ?? token.sub; // id
        token.email = user.email ?? token.email; // email
        token.name = user.name ?? token.name; // name
        // NextAuth uses `picture` on the token
        // (Google sets this automatically; credentials won’t unless we do)
        // @ts-expect-error: token.picture is allowed
        token.picture = (user as any).image ?? (token as any).picture;
        // custom role
        (token as any).role =
          (user as any).role ?? (token as any).role ?? "user";
      }

      // If we still don’t have a role (e.g., returning session), fetch once
      if (!(token as any).role && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email })
          .select("role")
          .lean();
        (token as any).role = dbUser?.role ?? "user";
      }

      return token;
    },

    // ⬇️ Hydrate the session from the token
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub || "";
        session.user.email = token.email ?? session.user.email ?? undefined;
        session.user.name = token.name ?? session.user.name ?? undefined;
        // @ts-expect-error: token.picture may exist
        session.user.image =
          (token as any).picture ?? session.user.image ?? undefined;
        session.user.role =
          typeof (token as any).role === "string"
            ? (token as any).role
            : "user";
      }
      return session;
    },

    async redirect({ baseUrl }) {
      return new URL("/products", baseUrl).toString();
    },
  },
});

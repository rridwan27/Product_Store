"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 container items-center px-4 py-8">
        {/* Left: brand */}
        <Link href="/" className="font-bold tracking-tight text-3xl">
          Jubilee
        </Link>

        {/* Center: nav links */}
        <nav className="pointer-events-auto absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-1">
            <li className="">
              <NavLink href="/">
                <span className="text-lg">Home</span>
              </NavLink>
            </li>
            <li className="">
              <NavLink href="/products">
                <span className="text-lg">Products</span>
              </NavLink>
            </li>
            <li className="">
              <NavLink href="/dashboard">
                <span className="text-lg">Dashboard</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Right: auth controls */}
        <div className="ml-auto flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full outline-none">
                <Avatar className="h-8 w-8 border-2 border-violet-500">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
                  <AvatarFallback>
                    {(user.name ?? "U")
                      .split(" ")
                      .map((s) => s[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="space-y-0.5">
                  <div className="text-sm font-medium leading-none">
                    {user.name ?? "User"}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/products">Products</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}

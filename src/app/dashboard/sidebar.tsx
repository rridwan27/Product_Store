"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  PackagePlus,
  Users,
  User,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Role = "admin" | "user";

type Item = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
};

const NAV_ITEMS: Item[] = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "user"],
  },
  {
    label: "Add Product",
    href: "/dashboard/add-product",
    icon: PackagePlus,
    roles: ["admin"],
  },

  { label: "Users", href: "/dashboard/users", icon: Users, roles: ["admin"] },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roles: ["admin", "user"],
  },
];

interface SessionUser {
  role?: Role;
}

function useRole(): Role {
  const { data } = useSession();
  const user = data?.user as SessionUser | undefined;
  return user?.role || "user";
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  collapsed,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const role = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const items = useMemo(
    () => NAV_ITEMS.filter((i) => i.roles.includes(role)),
    [role]
  );

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b bg-background px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent
              items={items}
              pathname={pathname}
              collapsed={false}
              onSignOut={() => signOut({ callbackUrl: "/" })}
            />
          </SheetContent>
        </Sheet>
        <div className="font-bold">Jubilee – dashboard</div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:gap-2 lg:border-r lg:bg-background lg:pt-4",
          collapsed ? "lg:w-[72px]" : "lg:w-64"
        )}
      >
        <div className="flex items-center justify-between px-3">
          <Link href="/" className="font-semibold text-3xl tracking-tight">
            {collapsed ? "JB" : "Jubilee"}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        <SidebarContent
          items={items}
          pathname={pathname}
          collapsed={collapsed}
          onSignOut={() => signOut({ callbackUrl: "/" })}
        />
      </aside>
    </>
  );
}

function SidebarContent({
  items,
  pathname,
  collapsed,
  onSignOut,
}: {
  items: Item[];
  pathname: string | null;
  collapsed: boolean;
  onSignOut: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-2 px-2">
      <nav className="mt-2 grid gap-1">
        {items.map((i) => (
          <NavItem
            key={i.href}
            href={i.href}
            icon={i.icon}
            label={i.label}
            active={
              pathname === i.href ||
              (i.href !== "/dashboard" && pathname?.startsWith(i.href))
            }
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="mt-auto pb-3">
        <Separator className="my-2" />
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            collapsed && "justify-center"
          )}
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Sign out"}
        </Button>
      </div>
    </div>
  );
}

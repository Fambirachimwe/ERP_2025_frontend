"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user has admin access
  const isAdmin = session?.user?.roles?.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );

  const items = [
    {
      title: "Overview",
      href: "/dashboard",
      show: true, // Always show overview
    },
    {
      title: "Assets",
      href: "/dashboard/assets",
      show: isAdmin,
    },
    {
      title: "References",
      href: "/dashboard/references",
      show: true, // Always show references
    },
    {
      title: "Leaves",
      href: "/dashboard/leaves",
      show: true, // Always show leaves
    },
    {
      title: "Users",
      href: "/dashboard/users",
      show: isAdmin,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      show: true, // Always show settings
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {items
        .filter((item) => item.show)
        .map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
    </nav>
  );
}

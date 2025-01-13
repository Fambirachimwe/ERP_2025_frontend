"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  MonitorDot,
  FileText,
  Settings,
  Users,
  Files,
  Calendar,
} from "lucide-react";

export function SideNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Check if user has admin access
  const isAdmin = session?.user?.roles?.some((role) =>
    ["sysAdmin", "administrator"].includes(role)
  );

  // Define menu items based on user role
  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      show: true,
    },
    {
      title: "Assets",
      href: "/dashboard/assets",
      icon: Box,
      show: isAdmin,
    },
    {
      title: "Monitoring",
      href: "/dashboard/monitoring",
      icon: MonitorDot,
      show: isAdmin,
    },
    {
      title: "References",
      href: "/dashboard/references",
      icon: FileText,
      show: true,
    },
    {
      title: "Leaves",
      href: "/dashboard/leaves",
      icon: Calendar,
      show: true,
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: Users,
      show: isAdmin,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      show: true,
    },
  ];

  return (
    <div className="relative hidden h-screen border-r pt-4 md:block w-56">
      <div className="px-3 py-4 border-b">
        <Link href="/dashboard" className="flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="ERP Logo"
            width={150}
            height={30}
            className="block dark:hidden"
            priority
          />
          <Image
            src="/logo.png"
            alt="ERP Logo"
            width={150}
            height={30}
            className="hidden dark:block"
            priority
          />
        </Link>
      </div>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {menuItems
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                    pathname === item.href
                      ? "bg-gray-200 text-gray-900"
                      : "text-gray-500 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

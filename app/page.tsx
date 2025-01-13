"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Box,
  MonitorDot,
  FileText,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  const router = useRouter();

  const modules = [
    {
      title: "Asset Management",
      description: "Track and manage all company assets efficiently",
      icon: Box,
      href: "/dashboard/assets",
      color: "bg-[#8B2332]/90",
    },
    {
      title: "Asset Monitoring",
      description: "Monitor asset status and maintenance schedules",
      icon: MonitorDot,
      href: "/dashboard/monitoring",
      color: "bg-[#725F4B]/90",
    },
    {
      title: "Leave Management",
      description: "Handle employee leave requests and approvals",
      icon: Calendar,
      href: "/dashboard/leaves",
      color: "bg-[#8B2332]/90",
    },
    {
      title: "Reference App",
      description: "Organize and track important documents",
      icon: FileText,
      href: "/dashboard/references",
      color: "bg-[#725F4B]/90",
    },
    {
      title: "User Management",
      description: "Manage system users and their roles",
      icon: Users,
      href: "/dashboard/users",
      color: "bg-[#8B2332]/90",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F3F7] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Image
            src="/logo.png"
            alt="UIP Logo"
            width={120}
            height={30}
            priority
            className="hover:opacity-90 transition-opacity"
          />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="text-[#8B2332] hover:bg-[#8B2332]/10 transition-colors dark:text-white"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#8B2332] sm:text-6xl bg-gradient-to-r from-[#8B2332] to-[#725F4B] bg-clip-text text-transparent">
          Welcome to UIP ERP System
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-lg text-[#725F4B]"></p>
      </section>

      {/* Modules Grid */}
      <section className="container mx-auto px-4 py-2">
        <h2 className="mb-12 text-center text-3xl font-bold text-[#725F4B]">
          Available Modules
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <div
              key={module.title}
              onClick={() => router.push(module.href)}
              className="group cursor-pointer rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#8B2332]/20"
            >
              <div
                className={`mb-4 inline-flex rounded-lg p-3 ${module.color} text-white/90 ring-1 ring-inset ring-white/20`}
              >
                <module.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[#8B2332]">
                {module.title}
              </h3>
              <p className="text-[#725F4B]/80">{module.description}</p>
              <div className="mt-4 flex items-center text-[#8B2332] group-hover:text-[#725F4B] transition-colors">
                <span className="text-sm font-medium">Learn more</span>
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-[#725F4B]/80">
          <p>
            © 2024 Urban Infrastructure Projects Africa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

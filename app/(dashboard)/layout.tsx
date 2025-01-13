import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { MainNav, SideNav, UserNav } from "@/components/dashboard";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <SideNav />
        <div className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center justify-between px-4">
              <MainNav />
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <UserNav user={session.user} />
              </div>
            </div>
          </div>
          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

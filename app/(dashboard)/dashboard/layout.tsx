import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ERP System Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

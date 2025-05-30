"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, LayoutDashboard, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();

  const navigation = [
    {
      id: 1,
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      id: 2,
      label: "Faculty",
      href: "/admin/faculty-list",
      icon: Users,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <span className="font-semibold text-lg text-slate-900">
            FPMS Admin
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary-foreground" : "text-slate-500"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

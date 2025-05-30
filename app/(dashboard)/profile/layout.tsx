"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  UserCircle,
  GraduationCap,
  ClipboardList,
  Lightbulb,
  Users,
  Building2,
  BookOpen,
  ScrollText,
  FlaskConical,
  Compass,
  Award,
  Medal
} from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();
  
  const navigation = [
    {
      id: 1,
      label: "Basic Info",
      href: "/profile/basic-info",
      icon: UserCircle
    },
    {
      id: 2,
      label: "Teaching Activities",
      href: "/profile/teaching-activities",
      icon: GraduationCap
    },
    {
      id: 3,
      label: "Exam Duties",
      href: "/profile/exam-duties",
      icon: ClipboardList
    },
    {
      id: 4,
      label: "Teaching Innovations",
      href: "/profile/teaching-innovations",
      icon: Lightbulb
    },
    {
      id: 5,
      label: "Co-curricular Activities",
      href: "/profile/co-curricular-activities",
      icon: Users
    },
    {
      id: 6,
      label: "Administrative Roles",
      href: "/profile/administrative-roles",
      icon: Building2
    },
    {
      id: 7,
      label: "Professional Development",
      href: "/profile/professional-development",
      icon: BookOpen
    },
    {
      id: 8,
      label: "Research Publications",
      href: "/profile/research-publications",
      icon: ScrollText
    },
    {
      id: 9,
      label: "Projects",
      href: "/profile/projects",
      icon: FlaskConical
    },
    {
      id: 10,
      label: "Research Guidance",
      href: "/profile/research-guidance",
      icon: Compass
    },
    {
      id: 11,
      label: "Awards",
      href: "/profile/awards",
      icon: Award
    },
    {
      id: 12,
      label: "Certifications",
      href: "/profile/certifications",
      icon: Medal
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1">
            <UserCircle className="h-6 w-6 text-primary" />
          </div>
          <span className="font-semibold text-lg text-slate-900">Faculty Profile</span>
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
              <item.icon className={cn(
                "h-4 w-4",
                isActive ? "text-primary-foreground" : "text-slate-500"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

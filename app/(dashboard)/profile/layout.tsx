import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex p-5">
      <Sidebar />
      <div className="w-full">{children}</div>
    </div>
  );
}

const Sidebar = () => {
  const pages = [
    {
      id: 1,
      label: "Basic Info",
      href: "/profile/basic-info",
    },
    {
      id: 2,
      label: "Teaching Activities",
      href: "/profile/teaching-activities",
    },
    {
      id: 3,
      label: "Exam Duties",
      href: "/profile/exam-duties",
    },
    {
      id: 4,
      label: "Teaching Innovations",
      href: "/profile/teaching-innovations",
    },
    {
      id: 5,
      label: "Co-curricular Activities",
      href: "/profile/co-curricular-activities",
    },
    {
      id: 6,
      label: "Administrative Roles",
      href: "/profile/administrative-roles",
    },
    {
      id: 7,
      label: "Professional Development",
      href: "/profile/professional-development",
    },
    {
      id: 8,
      label: "Research Publications",
      href: "/profile/research-publications",
    },
    {
      id: 9,
      label: "Projects",
      href: "/profile/projects",
    },
    {
      id: 10,
      label: "Research Guidance",
      href: "/profile/research-guidance",
    },
    {
      id: 11,
      label: "Awards",
      href: "/profile/awards",
    },
    {
      id: 12,
      label: "Certifications",
      href: "/profile/certifications",
    },
  ];
  return (
    <div className="p-5 border-r border-gray-200">
      <div className="flex flex-col gap-4">
        {pages.map((page) => (
          <Link prefetch={true} key={page.id} href={page.href}>
            {page.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

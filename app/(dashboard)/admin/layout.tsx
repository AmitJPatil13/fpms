import Link from "next/link";

export default function AdminLayout({
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
      label: "Faculty List",
      href: "/admin/faculty-list",
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
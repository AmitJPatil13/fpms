import { redirect } from "next/navigation";

import { getSession } from "redshield";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.status) {
    redirect("/login");
  }
  return <>{children}</>;
}

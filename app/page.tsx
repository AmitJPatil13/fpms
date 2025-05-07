import { getSession } from "redshield";
import LogOutComponent from "@/components/LogOutButtonComponent";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await getSession();
  if (!session.status) {
    redirect("/login");
  }
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {session.status ? (
        <div>
          <p>Logged in {session.data.isAdmin.toString()}</p>
          <LogOutComponent />
        </div>
      ) : (
        <p>Logged out</p>
      )}
    </main>
  );
}

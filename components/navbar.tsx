import Link from "next/link";
import { getSession } from "redshield";
import LogOutComponent from "./LogOutButtonComponent";
import { Button } from "./ui/button";

export default async function Navbar() {
  const session = await getSession();
  return (
    <div className="flex items-center justify-between p-4 bg-zinc-50 border-b border-zinc-200">
      <Link href="/" className="text-2xl font-bold">
        FPMS
      </Link>
      <div className="flex items-center gap-4">
        {session.status &&
          (session.status && session.data.isAdmin ? (
            <Link href="/admin">Admin</Link>
          ) : (
            <Link href="/faculty">Faculty</Link>
          ))}

        {session.status ? (
          <LogOutComponent />
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

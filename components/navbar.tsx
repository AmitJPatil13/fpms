import Link from "next/link";
import { getSession } from "redshield";
import LogOutComponent from "./LogOutButtonComponent";
import { Button } from "./ui/button";
import { Home, User, Shield } from "lucide-react";

export default async function Navbar() {
  const session = await getSession();
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-200 shadow-sm">
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span>FPMS</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            {session.status && (
              <Link 
                href={session.data.isAdmin ? "/admin" : "/faculty"}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {session.data.isAdmin ? (
                  <>
                    <Shield className="h-5 w-5" />
                    <span>Admin Dashboard</span>
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5" />
                    <span>Faculty Dashboard</span>
                  </>
                )}
              </Link>
            )}

            {/* Auth Button */}
            <div className="flex items-center">
              {session.status ? (
                <LogOutComponent />
              ) : (
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

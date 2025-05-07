import React from "react";
import { LoginForm } from "@/components/login-form";
import { getSession } from "redshield";
import { redirect } from "next/navigation";
const page = async () => {
  const session = await getSession();
  if (session.status) {
    redirect("/");
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm />
    </div>
  );
};

export default page;

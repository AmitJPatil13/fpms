import { getSession } from "redshield";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Users, Award } from "lucide-react";

export default async function Home() {
  const session = await getSession();
  
  if (!session.status) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-white border-b">
          <div className="container mx-auto px-6 py-16">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Faculty Performance Management System
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl">
                A comprehensive platform for managing and tracking faculty performance,
                academic activities, and professional development.
              </p>
              <Button asChild size="lg">
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const features = [
    {
      title: "Faculty Management",
      description: "Comprehensive tools for managing faculty profiles, performance metrics, and evaluations.",
      icon: Users,
      color: "text-blue-500"
    },
    {
      title: "Academic Activities",
      description: "Track teaching hours, research publications, and professional development.",
      icon: GraduationCap,
      color: "text-green-500"
    },
    {
      title: "Research & Publications",
      description: "Monitor and showcase research output, publications, and academic contributions.",
      icon: BookOpen,
      color: "text-purple-500"
    },
    {
      title: "Awards & Recognition",
      description: "Highlight achievements, awards, and recognition received by faculty members.",
      icon: Award,
      color: "text-amber-500"
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Welcome to FPMS
            </h1>
            <p className="text-lg text-slate-600 mb-8 max-w-2xl">
              {session.data.isAdmin 
                ? "Access administrative tools and manage faculty performance."
                : "Track your academic activities and professional development."}
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={session.data.isAdmin ? "/admin" : "/faculty"}>
                  Go to {session.data.isAdmin ? "Admin" : "Faculty"} Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-slate-300 transition-all">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-6 text-center text-slate-600">
          <p>© {new Date().getFullYear()} Faculty Performance Management System. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

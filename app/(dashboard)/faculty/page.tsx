import { getFacultyStats, checkProfileCompletion } from "./actions";
import { GeneralFacultyInfo } from "./_components/general";
import { FacultyProfile } from "./_components/profile";
import { getSession } from "redshield";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  BookOpen,
  GraduationCap,
  Award,
  Clock,
} from "lucide-react";
import Link from "next/link";

export default async function FacultyPage() {
  const session = await getSession();

  if (!session?.status || !session?.data?.email) {
    return null;
  }

  const [statsResult, completionResult] = await Promise.all([
    getFacultyStats(session.data.email),
    checkProfileCompletion(session.data.email),
  ]);

  // Profile completion warning section
  const ProfileWarning = () => {
    if (!completionResult.success) {
      return (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="flex items-center gap-3 py-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <p className="text-yellow-800">
              Unable to check profile status. Please try again later.
            </p>
          </CardContent>
        </Card>
      );
    }

    if (!completionResult.data) {
      return (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <p className="text-yellow-800">
                Your profile is incomplete. Please update your details.
              </p>
            </div>
            <Button asChild variant="outline" className="bg-white">
              <Link href="/faculty/profile">Complete Profile</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="p-5 space-y-6 bg-slate-50 min-h-screen">
      {/* Profile Warning Banner */}
      <ProfileWarning />

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Teaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsResult.data?.teachingHours || 0}</div>
            <p className="text-xs text-slate-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Publications</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsResult.data?.publicationsCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Upcoming Activities</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsResult.data?.upcomingActivitiesCount || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Performance Change</CardTitle>
            <Award className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsResult.data?.hoursChange ? `${statsResult.data.hoursChange.toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-slate-500 mt-1">From last month</p>
          </CardContent>
        </Card>
      </div> */}

      {/* Detailed Stats */}
      <GeneralFacultyInfo stats={statsResult.data} />

      {/* Profile Section */}
      <FacultyProfile isCompleted={completionResult.data?.isComplete} />
    </div>
  );
}

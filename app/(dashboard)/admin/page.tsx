import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { AreaChart, BarChart, DonutChart } from "@tremor/react";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { 
  users, 
  projects, 
  researchPublications, 
  basicInfo,
  teachingActivities 
} from "@/db/schema";
import { Users, BookOpen, FlaskConical, GraduationCap } from "lucide-react";
import { DashboardCharts } from "./components/dashboard-charts";

async function getDashboardData() {
  // Get total faculty count
  const [facultyCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  // Get active projects count
  const [activeProjects] = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(sql`date_completed IS NULL`);

  // Get publications this year
  const [publicationsThisYear] = await db
    .select({ count: sql<number>`count(*)` })
    .from(researchPublications)
    .where(sql`EXTRACT(YEAR FROM date_published) = EXTRACT(YEAR FROM CURRENT_DATE)`);

  // Get department-wise faculty distribution
  const departmentDistribution = await db
    .select({
      department: basicInfo.department,
      count: sql<number>`count(*)`,
    })
    .from(basicInfo)
    .groupBy(basicInfo.department);

  // Get publication types distribution
  const publicationDistribution = await db
    .select({
      type: researchPublications.publicationType,
      count: sql<number>`count(*)`,
    })
    .from(researchPublications)
    .groupBy(researchPublications.publicationType);

  // Get performance trend (teaching hours by month)
  const performanceTrend = await db
    .select({
      month: sql<string>`TO_CHAR(created_at, 'Mon YY')`,
      hours: sql<number>`SUM(lecture_hours + tutorial_hours + practical_hours)`,
    })
    .from(teachingActivities)
    .groupBy(sql`TO_CHAR(created_at, 'Mon YY')`)
    .orderBy(sql`TO_CHAR(created_at, 'Mon YY')`)
    .limit(6);

  return {
    facultyCount: facultyCount.count,
    activeProjects: activeProjects.count,
    publicationsThisYear: publicationsThisYear.count,
    departmentDistribution,
    publicationDistribution,
    performanceTrend,
  };
}

export default async function AdminPage() {
  const data = await getDashboardData();

  // Format data for charts
  const chartdata = data.performanceTrend.map((item) => ({
    date: item.month,
    "Teaching Hours": item.hours,
  }));

  const departmentData = data.departmentDistribution.map((item) => ({
    department: item.department,
    "Faculty Count": item.count,
  }));

  const publicationData = data.publicationDistribution.map((item) => ({
    name: item.type,
    value: item.count,
  }));

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <div className="text-sm text-slate-600">Last updated: {new Date().toLocaleString()}</div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Faculty</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.facultyCount}</div>
            <p className="text-xs text-slate-500 mt-1">Active members</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Research Projects</CardTitle>
            <FlaskConical className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.activeProjects}</div>
            <p className="text-xs text-slate-500 mt-1">Ongoing projects</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Publications This Year</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">{data.publicationsThisYear}</div>
            <p className="text-xs text-slate-500 mt-1">Research papers published</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg Teaching Hours/Month</CardTitle>
            <GraduationCap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(chartdata.reduce((acc, curr) => acc + curr["Teaching Hours"], 0) / chartdata.length)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Hours per faculty</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Move to client component */}
      <DashboardCharts 
        chartdata={chartdata}
        departmentData={departmentData}
        publicationData={publicationData}
      />
    </div>
  );
}

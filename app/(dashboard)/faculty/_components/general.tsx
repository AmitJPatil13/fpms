import { Clock, FileText, Star, Users, Award, Briefcase, Medal } from "lucide-react";

interface FacultyStats {
  teachingHours: number;
  publicationsCount: number;
  upcomingActivitiesCount: number;
  projectsCount: number;
  certificationsCount: number;
  hoursChange: number;
  monthlyHours: Array<{
    month: string;
    hours: number;
  }>;
}

interface GeneralFacultyInfoProps {
  stats?: FacultyStats;
}

export const GeneralFacultyInfo = ({ stats }: GeneralFacultyInfoProps) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Teaching Hours Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Teaching Hours</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">{stats.teachingHours}</h3>
            <p className={stats.hoursChange >= 0 ? "text-green-600 text-sm mt-2" : "text-red-600 text-sm mt-2"}>
              {stats.hoursChange >= 0 ? "+" : ""}{stats.hoursChange.toFixed(1)}% from last month
            </p>
          </div>
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
      </div>

      {/* Research Papers Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Research Papers</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">{stats.publicationsCount}</h3>
            <p className="text-green-600 text-sm mt-2">Published this year</p>
          </div>
          <FileText className="h-8 w-8 text-purple-500" />
        </div>
      </div>

      {/* Projects Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Research Projects</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">{stats.projectsCount}</h3>
            <p className="text-blue-600 text-sm mt-2">Total active projects</p>
          </div>
          <Briefcase className="h-8 w-8 text-green-500" />
        </div>
      </div>

      {/* Certifications Card */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Certifications</p>
            <h3 className="text-2xl font-bold text-gray-700 mt-2">{stats.certificationsCount}</h3>
            <p className="text-amber-600 text-sm mt-2">Professional certificates</p>
          </div>
          <Medal className="h-8 w-8 text-amber-500" />
        </div>
      </div>
    </div>
  );
};

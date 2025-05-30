import { getFacultyDetails, calculatePerformanceScore } from "./actions";
import FacultyDetailsClient from "./FacultyDetailsClient";

export default async function FacultyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [facultyResult, scoreResult] = await Promise.all([
    getFacultyDetails(params.id),
    calculatePerformanceScore(params.id)
  ]);

  const { data: faculty, error: facultyError } = facultyResult;
  const { data: performanceScore, error: scoreError } = scoreResult;

  if (facultyError) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">{facultyError}</div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Faculty member not found
        </div>
      </div>
    );
  }

  return <FacultyDetailsClient faculty={faculty} performanceScore={performanceScore} />;
} 
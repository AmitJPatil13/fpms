import React from "react";
import { getFacultyDetails, calculatePerformanceScore } from "./actions";
import Link from "next/link";
import DownloadButton from './DownloadButton';

type FacultyData = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  basicInfo: {
    department: string;
    designation: string;
    isHod: boolean;
    bio: string | null;
  } | null;
  teachings: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    subjectName: string;
    lectureHours: number;
    tutorialHours: number;
    practicalHours: number;
    extraHours: number;
    createdAt: Date | null;
  }>;
  publications: Array<{
    id: number;
    userEmail: string;
    title: string;
    publicationType: string;
    journalName: string;
    issnIsbn: string | null;
    impactFactor: string | null;
    datePublished: string;
    level: string;
    createdAt: Date | null;
  }>;
  projects: Array<{
    id: number;
    userEmail: string;
    projectTitle: string;
    fundingAgency: string;
    amountFunded: string;
    projectType: string;
    dateStarted: string;
    dateCompleted: string | null;
    createdAt: Date | null;
  }>;
  guidance: Array<{
    id: number;
    userEmail: string;
    scholarName: string;
    degree: string;
    status: string;
    year: number;
    createdAt: Date | null;
  }>;
  roles: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    roleTitle: string;
    hoursSpent: number;
    createdAt: Date | null;
  }>;
  development: Array<{
    id: number;
    userEmail: string;
    eventTitle: string;
    eventType: string;
    academicYear: string;
    durationDays: number;
    dateFrom: string;
    dateTo: string;
    organizedBy: string;
    createdAt: Date | null;
  }>;
  innovations: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    description: string;
    hoursSpent: number;
    toolUsed: string;
    createdAt: Date | null;
  }>;
  certifications: Array<{
    id: number;
    userEmail: string;
    certTitle: string;
    domain: string;
    certType: string;
    issuingOrganization: string;
    dateIssued: string;
    durationHours: number;
    createdAt: Date | null;
  }>;
  awards: Array<{
    id: number;
    userEmail: string;
    title: string;
    entryType: string;
    level: string;
    date: string;
    createdAt: Date | null;
  }>;
  duties: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    dutyType: string;
    dutyDate: string;
    hoursSpent: number;
    createdAt: Date | null;
  }>;
  activities: Array<{
    id: number;
    userEmail: string;
    academicYear: string;
    activityType: string;
    hoursSpent: number;
    level: string;
    createdAt: Date | null;
  }>;
};

function PerformanceScoreCard({ score }: { 
  score: {
    totalScore: number;
    componentScores: {
      teaching: number;
      research: number;
      administrative: number;
      professional: number;
      innovation: number;
      additional: number;
    };
    grade: string;
    insights: string[];
    lastUpdated: string;
  } 
}) {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Performance Score</h2>
          <div className="text-sm text-gray-500">
            Last updated: {new Date(score.lastUpdated).toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{score.totalScore}</div>
              <div className="text-xl font-semibold text-blue-500">{score.grade}</div>
            </div>
          </div>
          
          <div className="ml-8 flex-1">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(score.componentScores).map(([key, value]) => (
                <div key={key} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600 capitalize">{key}</div>
                  <div className="flex items-center mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(value / getMaxScore(key)) * 100}%` }}
                      />
                    </div>
                    <div className="ml-2 text-sm font-medium">{value.toFixed(1)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {score.insights.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-2">Insights for Improvement</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {score.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function getMaxScore(component: string): number {
  switch (component) {
    case 'teaching':
    case 'research':
      return 25;
    case 'administrative':
    case 'professional':
      return 15;
    case 'innovation':
    case 'additional':
      return 10;
    default:
      return 100;
  }
}

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
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{facultyError}</div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          Faculty member not found
        </div>
      </div>
    );
  }

  const typedFaculty = faculty as FacultyData;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Faculty Details</h1>
        <div className="flex items-center gap-4">
          <DownloadButton faculty={typedFaculty} performanceScore={performanceScore} />
          <Link
            href="/admin/faculty-list"
            className="text-blue-500 hover:text-blue-600"
          >
            Back to List
          </Link>
        </div>
      </div>

      {performanceScore && <PerformanceScoreCard score={performanceScore} />}

      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium">{typedFaculty.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Email</p>
              <p className="font-medium">{typedFaculty.email}</p>
            </div>
            <div>
              <p className="text-gray-600">Department</p>
              <p className="font-medium">{typedFaculty.basicInfo?.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Designation</p>
              <p className="font-medium">{typedFaculty.basicInfo?.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="text-gray-600">Role</p>
              <p className="font-medium">
                {typedFaculty.basicInfo?.isHod ? "Head of Department" : "Faculty Member"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Joined On</p>
              <p className="font-medium">
                {new Date(typedFaculty.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {typedFaculty.basicInfo?.bio && (
            <div className="mt-4">
              <p className="text-gray-600">Bio</p>
              <p className="mt-1">{typedFaculty.basicInfo.bio}</p>
            </div>
          )}
        </div>
      </div>

      {/* Teaching Activities */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Teaching Activities</h2>
          {typedFaculty.teachings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Academic Year</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Lecture Hours</th>
                    <th className="px-4 py-2 text-left">Tutorial Hours</th>
                    <th className="px-4 py-2 text-left">Practical Hours</th>
                    <th className="px-4 py-2 text-left">Extra Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.teachings.map((teaching) => (
                    <tr key={teaching.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{teaching.academicYear}</td>
                      <td className="px-4 py-2">{teaching.subjectName}</td>
                      <td className="px-4 py-2">{teaching.lectureHours}</td>
                      <td className="px-4 py-2">{teaching.tutorialHours}</td>
                      <td className="px-4 py-2">{teaching.practicalHours}</td>
                      <td className="px-4 py-2">{teaching.extraHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No teaching activities found</p>
          )}
        </div>
      </div>

      {/* Research Publications */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Research Publications</h2>
          {typedFaculty.publications.length > 0 ? (
            <div className="space-y-4">
              {typedFaculty.publications.map((pub) => (
                <div key={pub.id} className="border-b pb-4">
                  <h3 className="font-medium">{pub.title}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p>{pub.publicationType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Journal</p>
                      <p>{pub.journalName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">ISSN/ISBN</p>
                      <p>{pub.issnIsbn || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Impact Factor</p>
                      <p>{pub.impactFactor || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Published Date</p>
                      <p>{new Date(pub.datePublished).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Level</p>
                      <p>{pub.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No research publications found</p>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          {typedFaculty.projects.length > 0 ? (
            <div className="space-y-4">
              {typedFaculty.projects.map((project) => (
                <div key={project.id} className="border-b pb-4">
                  <h3 className="font-medium">{project.projectTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600">Funding Agency</p>
                      <p>{project.fundingAgency}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount Funded</p>
                      <p>₹{project.amountFunded}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p>{project.projectType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p>
                        {new Date(project.dateStarted).toLocaleDateString()} -{" "}
                        {project.dateCompleted
                          ? new Date(project.dateCompleted).toLocaleDateString()
                          : "Ongoing"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No projects found</p>
          )}
        </div>
      </div>

      {/* Research Guidance */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Research Guidance</h2>
          {typedFaculty.guidance.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Scholar Name</th>
                    <th className="px-4 py-2 text-left">Degree</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.guidance.map((guide) => (
                    <tr key={guide.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{guide.scholarName}</td>
                      <td className="px-4 py-2">{guide.degree}</td>
                      <td className="px-4 py-2">{guide.status}</td>
                      <td className="px-4 py-2">{guide.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No research guidance found</p>
          )}
        </div>
      </div>

      {/* Administrative Roles */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Administrative Roles</h2>
          {typedFaculty.roles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Academic Year</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Hours Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{role.academicYear}</td>
                      <td className="px-4 py-2">{role.roleTitle}</td>
                      <td className="px-4 py-2">{role.hoursSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No administrative roles found</p>
          )}
        </div>
      </div>

      {/* Professional Development */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Professional Development</h2>
          {typedFaculty.development.length > 0 ? (
            <div className="space-y-4">
              {typedFaculty.development.map((dev) => (
                <div key={dev.id} className="border-b pb-4">
                  <h3 className="font-medium">{dev.eventTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p>{dev.eventType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Academic Year</p>
                      <p>{dev.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p>{dev.durationDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p>
                        {new Date(dev.dateFrom).toLocaleDateString()} -{" "}
                        {new Date(dev.dateTo).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Organized By</p>
                      <p>{dev.organizedBy}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No professional development activities found</p>
          )}
        </div>
      </div>

      {/* Teaching Innovations */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Teaching Innovations</h2>
          {typedFaculty.innovations.length > 0 ? (
            <div className="space-y-4">
              {typedFaculty.innovations.map((innovation) => (
                <div key={innovation.id} className="border-b pb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Academic Year</p>
                      <p>{innovation.academicYear}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tool Used</p>
                      <p>{innovation.toolUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Hours Spent</p>
                      <p>{innovation.hoursSpent}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-gray-600">Description</p>
                    <p className="mt-1">{innovation.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No teaching innovations found</p>
          )}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Certifications</h2>
          {typedFaculty.certifications.length > 0 ? (
            <div className="space-y-4">
              {typedFaculty.certifications.map((cert) => (
                <div key={cert.id} className="border-b pb-4">
                  <h3 className="font-medium">{cert.certTitle}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-gray-600">Domain</p>
                      <p>{cert.domain}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p>{cert.certType}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Issuing Organization</p>
                      <p>{cert.issuingOrganization}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Date Issued</p>
                      <p>{new Date(cert.dateIssued).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p>{cert.durationHours} hours</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No certifications found</p>
          )}
        </div>
      </div>

      {/* Awards */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Awards & Recognition</h2>
          {typedFaculty.awards.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Level</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.awards.map((award) => (
                    <tr key={award.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{award.title}</td>
                      <td className="px-4 py-2">{award.entryType}</td>
                      <td className="px-4 py-2">{award.level}</td>
                      <td className="px-4 py-2">
                        {new Date(award.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No awards found</p>
          )}
        </div>
      </div>

      {/* Exam Duties */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Exam Duties</h2>
          {typedFaculty.duties.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Academic Year</th>
                    <th className="px-4 py-2 text-left">Duty Type</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Hours Spent</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.duties.map((duty) => (
                    <tr key={duty.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{duty.academicYear}</td>
                      <td className="px-4 py-2">{duty.dutyType}</td>
                      <td className="px-4 py-2">
                        {new Date(duty.dutyDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{duty.hoursSpent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No exam duties found</p>
          )}
        </div>
      </div>

      {/* Co-curricular Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Co-curricular Activities</h2>
          {typedFaculty.activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Academic Year</th>
                    <th className="px-4 py-2 text-left">Activity Type</th>
                    <th className="px-4 py-2 text-left">Hours Spent</th>
                    <th className="px-4 py-2 text-left">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {typedFaculty.activities.map((activity) => (
                    <tr key={activity.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{activity.academicYear}</td>
                      <td className="px-4 py-2">{activity.activityType}</td>
                      <td className="px-4 py-2">{activity.hoursSpent}</td>
                      <td className="px-4 py-2">{activity.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No co-curricular activities found</p>
          )}
        </div>
      </div>
    </div>
  );
} 
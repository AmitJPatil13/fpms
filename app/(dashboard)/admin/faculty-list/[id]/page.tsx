import React from "react";
import { getFacultyDetails, calculatePerformanceScore } from "./actions";
import Link from "next/link";
import DownloadButton from './DownloadButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg mb-8 border border-gray-100">
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Performance Score
          </h2>
          <Badge variant="outline" className="bg-white shadow-sm">
            Last updated: {new Date(score.lastUpdated).toLocaleString()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-8 mb-8">
          <div className="relative">
            <div className="w-36 h-36 rounded-full border-8 border-primary/20 flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{score.totalScore}</div>
                <div className="text-xl font-semibold text-primary/80">{score.grade}</div>
              </div>
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-xl opacity-50 -z-10" />
          </div>
          
          <div className="flex-1">
            <div className="space-y-5">
              {Object.entries(score.componentScores).map(([key, value]) => (
                <div key={key} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium capitalize text-gray-700 group-hover:text-primary transition-colors">
                      {key}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <Progress 
                      value={(value / getMaxScore(key)) * 100} 
                      className="h-full transition-all duration-500 ease-out group-hover:scale-x-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {score.insights.length > 0 && (
          <div className="bg-gradient-to-r from-gray-50 to-transparent p-6 rounded-xl">
            <h3 className="text-lg font-medium mb-4 text-gray-800">Insights for Improvement</h3>
            <ul className="space-y-3">
              {score.insights.map((insight, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <span className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
                  <span className="text-gray-600 group-hover:text-gray-900 transition-colors">
                    {insight}
                  </span>
                </li>
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

  const typedFaculty = faculty as FacultyData;

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {typedFaculty.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-white shadow-sm">
              {typedFaculty.basicInfo?.department}
            </Badge>
            <Badge variant="outline" className="bg-white shadow-sm">
              {typedFaculty.basicInfo?.designation}
            </Badge>
            {typedFaculty.basicInfo?.isHod && (
              <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                HOD
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DownloadButton faculty={typedFaculty} performanceScore={performanceScore} />
          <Link
            href="/admin/faculty-list"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to List
          </Link>
        </div>
      </div>

      {performanceScore && <PerformanceScoreCard score={performanceScore} />}

      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-xl shadow-lg border border-gray-100 p-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-gray-100/50 p-1 rounded-lg">
            <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="teaching" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Teaching
            </TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Research
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Projects
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Administrative
            </TabsTrigger>
            <TabsTrigger value="development" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Development
            </TabsTrigger>
            <TabsTrigger value="awards" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Awards
            </TabsTrigger>
            <TabsTrigger value="activities" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Activities
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="font-medium text-gray-900">{typedFaculty.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Joined On</label>
                    <p className="font-medium text-gray-900">
                      {new Date(typedFaculty.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {typedFaculty.basicInfo?.bio && (
                  <>
                    <Separator className="my-6" />
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Bio</label>
                      <p className="text-gray-700 leading-relaxed">
                        {typedFaculty.basicInfo.bio}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* Teaching Tab */}
            <TabsContent value="teaching">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Teaching Activities</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.teachings.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.teachings.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Academic Year</TableHead>
                            <TableHead className="font-semibold">Subject</TableHead>
                            <TableHead className="font-semibold">Lecture Hours</TableHead>
                            <TableHead className="font-semibold">Tutorial Hours</TableHead>
                            <TableHead className="font-semibold">Practical Hours</TableHead>
                            <TableHead className="font-semibold">Extra Hours</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.teachings.map((teaching) => (
                            <TableRow key={teaching.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{teaching.academicYear}</TableCell>
                              <TableCell>{teaching.subjectName}</TableCell>
                              <TableCell>{teaching.lectureHours}</TableCell>
                              <TableCell>{teaching.tutorialHours}</TableCell>
                              <TableCell>{teaching.practicalHours}</TableCell>
                              <TableCell>{teaching.extraHours}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No teaching activities found</p>
                      </div>
                    )}

                    <Separator className="my-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Teaching Innovations</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.innovations.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.innovations.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {typedFaculty.innovations.map((innovation) => (
                          <AccordionItem 
                            key={innovation.id} 
                            value={innovation.id.toString()}
                            className="border border-gray-100 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{innovation.academicYear}</span>
                                <Badge variant="outline" className="bg-white">
                                  {innovation.toolUsed}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Hours Spent
                                  </label>
                                  <p className="text-gray-900">{innovation.hoursSpent}</p>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">
                                  Description
                                </label>
                                <p className="text-gray-700">{innovation.description}</p>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No teaching innovations found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Research Tab */}
            <TabsContent value="research">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Research Publications</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.publications.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.publications.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {typedFaculty.publications.map((pub) => (
                          <AccordionItem 
                            key={pub.id} 
                            value={pub.id.toString()}
                            className="border border-gray-100 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{pub.title}</span>
                                <Badge variant="outline" className="bg-white">
                                  {pub.publicationType}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Journal
                                  </label>
                                  <p className="text-gray-900">{pub.journalName}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    ISSN/ISBN
                                  </label>
                                  <p className="text-gray-900">{pub.issnIsbn || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Impact Factor
                                  </label>
                                  <p className="text-gray-900">{pub.impactFactor || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Published Date
                                  </label>
                                  <p className="text-gray-900">{new Date(pub.datePublished).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Level
                                  </label>
                                  <p className="text-gray-900">{pub.level}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No research publications found</p>
                      </div>
                    )}

                    <Separator className="my-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Research Guidance</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.guidance.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.guidance.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Scholar Name</TableHead>
                            <TableHead className="font-semibold">Degree</TableHead>
                            <TableHead className="font-semibold">Status</TableHead>
                            <TableHead className="font-semibold">Year</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.guidance.map((guide) => (
                            <TableRow key={guide.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{guide.scholarName}</TableCell>
                              <TableCell>{guide.degree}</TableCell>
                              <TableCell>
                                <Badge variant={guide.status === 'Completed' ? 'default' : 'outline'}>
                                  {guide.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{guide.year}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No research guidance found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Research Projects</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.projects.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.projects.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {typedFaculty.projects.map((project) => (
                          <AccordionItem 
                            key={project.id} 
                            value={project.id.toString()}
                            className="border border-gray-100 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{project.projectTitle}</span>
                                <Badge variant={project.dateCompleted ? 'default' : 'outline'}>
                                  {project.dateCompleted ? 'Completed' : 'Ongoing'}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Funding Agency
                                  </label>
                                  <p className="text-gray-900">{project.fundingAgency}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Amount Funded
                                  </label>
                                  <p className="text-gray-900">₹{project.amountFunded}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Type
                                  </label>
                                  <p className="text-gray-900">{project.projectType}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Duration
                                  </label>
                                  <p className="text-gray-900">
                                    {new Date(project.dateStarted).toLocaleDateString()} -{" "}
                                    {project.dateCompleted
                                      ? new Date(project.dateCompleted).toLocaleDateString()
                                      : "Ongoing"}
                                  </p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No projects found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Administrative Tab */}
            <TabsContent value="admin">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Administrative Roles</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.roles.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.roles.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Academic Year</TableHead>
                            <TableHead className="font-semibold">Role</TableHead>
                            <TableHead className="font-semibold">Hours Spent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.roles.map((role) => (
                            <TableRow key={role.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{role.academicYear}</TableCell>
                              <TableCell>{role.roleTitle}</TableCell>
                              <TableCell>{role.hoursSpent}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No administrative roles found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Development Tab */}
            <TabsContent value="development">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Professional Development</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.development.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.development.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {typedFaculty.development.map((dev) => (
                          <AccordionItem 
                            key={dev.id} 
                            value={dev.id.toString()}
                            className="border border-gray-100 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{dev.eventTitle}</span>
                                <Badge variant="outline" className="bg-white">
                                  {dev.eventType}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Academic Year
                                  </label>
                                  <p className="text-gray-900">{dev.academicYear}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Duration
                                  </label>
                                  <p className="text-gray-900">{dev.durationDays} days</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Date
                                  </label>
                                  <p className="text-gray-900">
                                    {new Date(dev.dateFrom).toLocaleDateString()} -{" "}
                                    {new Date(dev.dateTo).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Organized By
                                  </label>
                                  <p className="text-gray-900">{dev.organizedBy}</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No professional development activities found</p>
                      </div>
                    )}

                    <Separator className="my-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Certifications</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.certifications.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.certifications.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {typedFaculty.certifications.map((cert) => (
                          <AccordionItem 
                            key={cert.id} 
                            value={cert.id.toString()}
                            className="border border-gray-100 rounded-lg mb-4 overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <AccordionTrigger className="px-6 py-4 hover:bg-gray-50/50">
                              <div className="flex items-center gap-4">
                                <span className="font-medium">{cert.certTitle}</span>
                                <Badge variant="outline" className="bg-white">
                                  {cert.domain}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 py-4 bg-gray-50/30">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Type
                                  </label>
                                  <p className="text-gray-900">{cert.certType}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Issuing Organization
                                  </label>
                                  <p className="text-gray-900">{cert.issuingOrganization}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Date Issued
                                  </label>
                                  <p className="text-gray-900">{new Date(cert.dateIssued).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-sm font-medium text-gray-500">
                                    Duration
                                  </label>
                                  <p className="text-gray-900">{cert.durationHours} hours</p>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No certifications found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Awards Tab */}
            <TabsContent value="awards">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Awards & Recognition</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.awards.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.awards.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Title</TableHead>
                            <TableHead className="font-semibold">Type</TableHead>
                            <TableHead className="font-semibold">Level</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.awards.map((award) => (
                            <TableRow key={award.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{award.title}</TableCell>
                              <TableCell>{award.entryType}</TableCell>
                              <TableCell>{award.level}</TableCell>
                              <TableCell>{new Date(award.date).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No awards found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            {/* Activities Tab */}
            <TabsContent value="activities">
              <div className="bg-white rounded-xl shadow-sm">
                <ScrollArea className="h-[600px]">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Exam Duties</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.duties.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.duties.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Academic Year</TableHead>
                            <TableHead className="font-semibold">Duty Type</TableHead>
                            <TableHead className="font-semibold">Date</TableHead>
                            <TableHead className="font-semibold">Hours Spent</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.duties.map((duty) => (
                            <TableRow key={duty.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{duty.academicYear}</TableCell>
                              <TableCell>{duty.dutyType}</TableCell>
                              <TableCell>{new Date(duty.dutyDate).toLocaleDateString()}</TableCell>
                              <TableCell>{duty.hoursSpent}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No exam duties found</p>
                      </div>
                    )}

                    <Separator className="my-8" />

                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-gray-900">Co-curricular Activities</h3>
                      <Badge variant="outline" className="bg-white">
                        {typedFaculty.activities.length} Records
                      </Badge>
                    </div>
                    {typedFaculty.activities.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-gray-50/50">
                            <TableHead className="font-semibold">Academic Year</TableHead>
                            <TableHead className="font-semibold">Activity Type</TableHead>
                            <TableHead className="font-semibold">Hours Spent</TableHead>
                            <TableHead className="font-semibold">Level</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typedFaculty.activities.map((activity) => (
                            <TableRow key={activity.id} className="hover:bg-gray-50/50">
                              <TableCell className="font-medium">{activity.academicYear}</TableCell>
                              <TableCell>{activity.activityType}</TableCell>
                              <TableCell>{activity.hoursSpent}</TableCell>
                              <TableCell>{activity.level}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No co-curricular activities found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
} 
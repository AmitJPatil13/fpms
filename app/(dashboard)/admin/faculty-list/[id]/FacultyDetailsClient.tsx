"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import CertificateViewer from './CertificateViewer';
import DownloadButton from './DownloadButton';
import Link from "next/link";
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

interface FacultyDetailsClientProps {
  faculty: any;
  performanceScore: any;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Overall Score Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Overall Performance</h2>
          <Badge variant="outline" className="bg-white">
            {score.grade}
          </Badge>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-center">
            <div className="relative">
              <svg className="w-32 h-32">
                <circle
                  className="text-gray-100"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-primary"
                  strokeWidth="8"
                  strokeDasharray={360}
                  strokeDashoffset={360 - (360 * score.totalScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-3xl font-bold text-gray-900">{score.totalScore}</span>
                <span className="text-sm text-gray-500 block">points</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-4">
            Last updated: {formatDate(score.lastUpdated)}
          </p>
        </div>
      </div>

      {/* Component Scores */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(score.componentScores).map(([key, value]) => {
            const maxScore = getMaxScore(key);
            const percentage = (value / maxScore) * 100;
            let statusColor = "text-yellow-600";
            if (percentage >= 80) statusColor = "text-green-600";
            else if (percentage <= 40) statusColor = "text-red-600";
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize text-gray-700">
                    {key}
                  </span>
                  <span className={`text-sm font-semibold ${statusColor}`}>
                    {value.toFixed(1)} / {maxScore}
                  </span>
                </div>
                <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300 ease-in-out rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {getComponentDescription(key, percentage)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights Card */}
      {score.insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-3">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {score.insights.map((insight, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getComponentDescription(component: string, percentage: number): string {
  const status = percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : percentage >= 40 ? "Average" : "Needs Improvement";
  
  switch (component) {
    case 'teaching':
      return `${status} - Teaching effectiveness and student engagement`;
    case 'research':
      return `${status} - Research output and impact`;
    case 'administrative':
      return `${status} - Administrative contributions and leadership`;
    case 'professional':
      return `${status} - Professional development and growth`;
    case 'innovation':
      return `${status} - Teaching innovations and methodologies`;
    case 'additional':
      return `${status} - Extra-curricular and other contributions`;
    default:
      return status;
  }
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

export default function FacultyDetailsClient({ faculty, performanceScore }: FacultyDetailsClientProps) {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {faculty.name}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="bg-white shadow-sm">
              {faculty.basicInfo?.department}
            </Badge>
            <Badge variant="outline" className="bg-white shadow-sm">
              {faculty.basicInfo?.designation}
            </Badge>
            {faculty.basicInfo?.isHod && (
              <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80">
                HOD
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <DownloadButton faculty={faculty} performanceScore={performanceScore} />
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

          {/* Basic Info Tab */}
          <TabsContent value="basic">
            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="font-medium text-gray-900">{faculty.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Joined On</label>
                  <p className="font-medium text-gray-900">
                    {formatDate(faculty.createdAt).split(',')[0]}
                  </p>
                </div>
              </div>
              {faculty.basicInfo?.bio && (
                <>
                  <Separator className="my-6" />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500">Bio</label>
                    <p className="text-gray-700 leading-relaxed">
                      {faculty.basicInfo.bio}
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
                      {faculty.teachings.length} Records
                    </Badge>
                  </div>
                  {faculty.teachings.length > 0 ? (
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
                        {faculty.teachings.map((teaching: any) => (
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
                      {faculty.innovations.length} Records
                    </Badge>
                  </div>
                  {faculty.innovations.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {faculty.innovations.map((innovation: any) => (
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
                      {faculty.publications.length} Records
                    </Badge>
                  </div>
                  {faculty.publications.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {faculty.publications.map((pub: any) => (
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
                                <p className="text-gray-900">{formatDate(pub.datePublished).split(',')[0]}</p>
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
                      {faculty.guidance.length} Records
                    </Badge>
                  </div>
                  {faculty.guidance.length > 0 ? (
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
                        {faculty.guidance.map((guide: any) => (
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
                      {faculty.projects.length} Records
                    </Badge>
                  </div>
                  {faculty.projects.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {faculty.projects.map((project: any) => (
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
                                  {formatDate(project.dateStarted).split(',')[0]} -{" "}
                                  {project.dateCompleted
                                    ? formatDate(project.dateCompleted).split(',')[0]
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
                      {faculty.roles.length} Records
                    </Badge>
                  </div>
                  {faculty.roles.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-gray-50/50">
                          <TableHead className="font-semibold">Academic Year</TableHead>
                          <TableHead className="font-semibold">Role</TableHead>
                          <TableHead className="font-semibold">Hours Spent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {faculty.roles.map((role: any) => (
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
                      {faculty.development.length} Records
                    </Badge>
                  </div>
                  {faculty.development.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {faculty.development.map((dev: any) => (
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
                                  {formatDate(dev.dateFrom).split(',')[0]} -{" "}
                                  {formatDate(dev.dateTo).split(',')[0]}
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
                      {faculty.certifications.length} Records
                    </Badge>
                  </div>
                  {faculty.certifications.length > 0 ? (
                    <Accordion type="single" collapsible className="w-full">
                      {faculty.certifications.map((cert: any) => (
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
                                <p className="text-gray-900">
                                  {formatDate(cert.dateIssued).split(',')[0]}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">
                                  Duration
                                </label>
                                <p className="text-gray-900">{cert.durationHours} hours</p>
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                              <CertificateViewer certImg={cert.certImg} />
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
                      {faculty.awards.length} Records
                    </Badge>
                  </div>
                  {faculty.awards.length > 0 ? (
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
                        {faculty.awards.map((award: any) => (
                          <TableRow key={award.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{award.title}</TableCell>
                            <TableCell>{award.entryType}</TableCell>
                            <TableCell>{award.level}</TableCell>
                            <TableCell>{formatDate(award.date).split(',')[0]}</TableCell>
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
                      {faculty.duties.length} Records
                    </Badge>
                  </div>
                  {faculty.duties.length > 0 ? (
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
                        {faculty.duties.map((duty: any) => (
                          <TableRow key={duty.id} className="hover:bg-gray-50/50">
                            <TableCell className="font-medium">{duty.academicYear}</TableCell>
                            <TableCell>{duty.dutyType}</TableCell>
                            <TableCell>{formatDate(duty.dutyDate).split(',')[0]}</TableCell>
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
                      {faculty.activities.length} Records
                    </Badge>
                  </div>
                  {faculty.activities.length > 0 ? (
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
                        {faculty.activities.map((activity: any) => (
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
        </Tabs>
      </div>
    </div>
  );
} 
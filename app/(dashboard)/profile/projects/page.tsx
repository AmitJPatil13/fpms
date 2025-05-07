"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

enum ProjectType {
  SPONSORED = 'Sponsored',
  CONSULTANCY = 'Consultancy',
  INTERNAL = 'Internal',
  INDUSTRY_FUNDED = 'Industry Funded',
  GOVERNMENT_FUNDED = 'Government Funded',
}

type Project = {
  id: number;
  projectTitle: string;
  fundingAgency: string;
  amountFunded: number;
  projectType: ProjectType;
  dateStarted: string;
  dateCompleted: string;
};

const ProjectsPage = () => {
  // Example data - replace with actual data fetching
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: 1,
      projectTitle: "AI-based Learning Management System",
      fundingAgency: "Department of Science and Technology",
      amountFunded: 2500000,
      projectType: ProjectType.SPONSORED,
      dateStarted: "2023-06-01",
      dateCompleted: "2024-05-31",
    },
  ]);

  const [filters, setFilters] = React.useState({
    type: '',
    status: '',
    year: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteProject(id);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  // Calculate project status
  const getProjectStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (today < start) return "Not Started";
    if (today > end) return "Completed";
    return "Ongoing";
  };

  const validateDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return {
        isValid: false,
        message: "End date must be after start date"
      };
    }
    
    return { isValid: true };
  };

  const getProjectStats = () => {
    const today = new Date();
    return {
      totalProjects: projects.length,
      ongoingProjects: projects.filter(p => 
        new Date(p.dateStarted) <= today && new Date(p.dateCompleted) >= today
      ).length,
      completedProjects: projects.filter(p => 
        new Date(p.dateCompleted) < today
      ).length,
      totalFunding: projects.reduce((sum, p) => sum + p.amountFunded, 0),
    };
  };

  const filteredProjects = projects.filter(project => {
    if (filters.type && project.projectType !== filters.type) return false;
    if (filters.status) {
      const status = getProjectStatus(project.dateStarted, project.dateCompleted);
      if (status !== filters.status) return false;
    }
    if (filters.year) {
      const startYear = new Date(project.dateStarted).getFullYear().toString();
      if (startYear !== filters.year) return false;
    }
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project_title">Project Title</Label>
                <Input
                  type="text"
                  id="project_title"
                  name="project_title"
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project_type">Project Type</Label>
                <Select name="project_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ProjectType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="funding_agency">Funding Agency</Label>
                <Input
                  type="text"
                  id="funding_agency"
                  name="funding_agency"
                  placeholder="Enter funding agency name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount_funded">Amount Funded (₹)</Label>
                <Input
                  type="number"
                  id="amount_funded"
                  name="amount_funded"
                  min="0"
                  step="1000"
                  placeholder="Enter funding amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_started">Start Date</Label>
                <Input
                  type="date"
                  id="date_started"
                  name="date_started"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_completed">End Date</Label>
                <Input
                  type="date"
                  id="date_completed"
                  name="date_completed"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Funding Agency</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="max-w-[300px] truncate">
                      {project.projectTitle}
                    </TableCell>
                    <TableCell>{project.projectType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {project.fundingAgency}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.amountFunded.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell>
                      {new Date(project.dateStarted).toLocaleDateString()} - 
                      {new Date(project.dateCompleted).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        getProjectStatus(project.dateStarted, project.dateCompleted) === "Completed" 
                          ? "bg-green-100 text-green-800"
                          : getProjectStatus(project.dateStarted, project.dateCompleted) === "Ongoing"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {getProjectStatus(project.dateStarted, project.dateCompleted)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={3}>Total Projects: {projects.length}</TableCell>
                  <TableCell className="text-right">
                    ₹{projects.reduce((sum, proj) => sum + proj.amountFunded, 0).toLocaleString('en-IN')}
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage; 
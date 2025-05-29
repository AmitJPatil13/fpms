"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { getSession } from "redshield";
import { toast } from "sonner";

enum ProjectType {
  SPONSORED = "Sponsored",
  CONSULTANCY = "Consultancy",
  INTERNAL = "Internal",
  STUDENT = "Student",
}

enum ProjectStatus {
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  TERMINATED = "Terminated",
}

enum ProjectRole {
  PI = "Principal Investigator",
  COPI = "Co-Principal Investigator",
  INVESTIGATOR = "Investigator",
  CONSULTANT = "Consultant",
  MENTOR = "Mentor",
}

type Project = {
  id: number;
  projectTitle: string;
  projectType: ProjectType;
  fundingAgency: string;
  amountFunded: number;
  dateStarted: string;
  dateCompleted?: string;
};

const ProjectsPage = () => {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    projectTitle: "",
    projectType: "",
    fundingAgency: "",
    amountFunded: 0,
    dateStarted: "",
    dateCompleted: "",
  });

  // Fetch projects on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/projects");
          const data = await response.json();
          if (data.success) {
            setProjects(data.projects);
          }
        } catch (error) {
          console.error("Failed to fetch projects:", error);
          toast.error("Failed to load projects");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "amountFunded" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to add projects");
      return;
    }

    // Validate dates
    if (formData.dateCompleted && new Date(formData.dateCompleted) < new Date(formData.dateStarted)) {
      toast.error("Completion date cannot be earlier than start date");
      return;
    }

    // Validate amount
    if (formData.amountFunded < 0) {
      toast.error("Amount cannot be negative");
      return;
    }

    // Validate amount precision
    const amountStr = formData.amountFunded.toString();
    const [whole, decimal] = amountStr.split('.');
    if (whole.length > 10 || (decimal && decimal.length > 2)) {
      toast.error("Amount exceeds maximum precision (10 digits with 2 decimal places)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session.data.email,
          ...formData,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        setFormData({
          projectTitle: "",
          projectType: "",
          fundingAgency: "",
          amountFunded: 0,
          dateStarted: "",
          dateCompleted: "",
        });
        toast.success("Project added successfully");
      } else {
        throw new Error(data.message || "Failed to add project");
      }
    } catch (error) {
      console.error("Failed to add project:", error);
      toast.error("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete projects");
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setProjects(projects.filter((project) => project.id !== id));
        toast.success("Project deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  type="text"
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="Enter project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType">Project Type</Label>
                <Select
                  name="projectType"
                  value={formData.projectType}
                  onValueChange={(value) => handleSelectChange("projectType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
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
                <Label htmlFor="fundingAgency">Funding Agency</Label>
                <Input
                  type="text"
                  id="fundingAgency"
                  name="fundingAgency"
                  value={formData.fundingAgency}
                  onChange={handleInputChange}
                  placeholder="Enter funding agency name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountFunded">Amount Funded (₹)</Label>
                <Input
                  type="number"
                  id="amountFunded"
                  name="amountFunded"
                  value={formData.amountFunded}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter amount funded"
                  required
                />
                <span className="text-sm text-gray-500">
                  Maximum: 9999999999.99
                </span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateStarted">Start Date</Label>
                <Input
                  type="date"
                  id="dateStarted"
                  name="dateStarted"
                  value={formData.dateStarted}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateCompleted">Completion Date</Label>
                <Input
                  type="date"
                  id="dateCompleted"
                  name="dateCompleted"
                  value={formData.dateCompleted}
                  onChange={handleInputChange}
                  min={formData.dateStarted}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Project"}
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
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Funding Agency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Amount (₹)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.projectTitle}
                    </TableCell>
                    <TableCell>{project.projectType}</TableCell>
                    <TableCell>{project.fundingAgency}</TableCell>
                    <TableCell>
                      {new Date(project.dateStarted).toLocaleDateString()}
                      {project.dateCompleted
                        ? ` - ${new Date(project.dateCompleted).toLocaleDateString()}`
                        : " (Ongoing)"}
                    </TableCell>
                    <TableCell className="text-right">
                      {project.amountFunded.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
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
                  <TableCell colSpan={4}>Total Amount Funded</TableCell>
                  <TableCell className="text-right">
                    {projects.reduce((sum, project) => sum + project.amountFunded, 0)
                      .toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}
                  </TableCell>
                  <TableCell></TableCell>
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
"use client";
import React from "react";
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
import { getSession } from "redshield";
import { toast } from "sonner";

// Define enum for common administrative roles
enum RoleTitle {
  HOD = "Head of Department",
  CLASS_COORDINATOR = "Class Coordinator",
  EXAM_COORDINATOR = "Exam Coordinator",
  TIMETABLE_COORDINATOR = "Timetable Coordinator",
  PLACEMENT_COORDINATOR = "Placement Coordinator",
  RESEARCH_COORDINATOR = "Research Coordinator",
  ACADEMIC_COORDINATOR = "Academic Coordinator",
  LAB_INCHARGE = "Laboratory In-charge",
  DEPARTMENT_SECRETARY = "Department Secretary",
  COMMITTEE_MEMBER = "Committee Member",
}

type AdministrativeRole = {
  id: number;
  academicYear: string;
  roleTitle: RoleTitle;
  hoursSpent: number;
};

const AdministrativeRolesPage = () => {
  const [roles, setRoles] = React.useState<AdministrativeRole[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    roleTitle: "",
    hoursSpent: 0,
  });
  const [session, setSession] = React.useState<any>(null);

  // Fetch session and roles on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/administrative-roles");
          const data = await response.json();
          if (data.success) {
            setRoles(data.roles);
          }
        } catch (error) {
          console.error("Failed to fetch roles:", error);
          toast.error("Failed to load administrative roles");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      roleTitle: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to add roles");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/administrative-roles", {
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
        setRoles((prev) => [...prev, data.role]);
        setFormData({
          academicYear: "",
          roleTitle: "",
          hoursSpent: 0,
        });
        toast.success("Administrative role added successfully");
      } else {
        throw new Error(data.message || "Failed to add role");
      }
    } catch (error) {
      console.error("Failed to add role:", error);
      toast.error("Failed to add administrative role");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete roles");
      return;
    }

    try {
      const response = await fetch(`/api/administrative-roles/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setRoles(roles.filter((role) => role.id !== id));
        toast.success("Role deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete role");
      }
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Administrative Role</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input
                  type="text"
                  id="academicYear"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2023-2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roleTitle">Role Title</Label>
                <Select
                  name="roleTitle"
                  value={formData.roleTitle}
                  onValueChange={handleSelectChange}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role title" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RoleTitle).map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hoursSpent">Hours Spent</Label>
                <Input
                  type="number"
                  id="hoursSpent"
                  name="hoursSpent"
                  value={formData.hoursSpent}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Estimated hours spent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Role"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Administrative Roles List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Role Title</TableHead>
                  <TableHead className="text-right">Hours Spent</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>{role.academicYear}</TableCell>
                    <TableCell>{role.roleTitle}</TableCell>
                    <TableCell className="text-right">
                      {role.hoursSpent}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(role.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={2}>Total Hours</TableCell>
                  <TableCell className="text-right">
                    {roles.reduce((sum, role) => sum + role.hoursSpent, 0)}
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

export default AdministrativeRolesPage;

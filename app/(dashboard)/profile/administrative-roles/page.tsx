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

// Define enum for common administrative roles
enum RoleTitle {
  HOD = 'Head of Department',
  CLASS_COORDINATOR = 'Class Coordinator',
  EXAM_COORDINATOR = 'Exam Coordinator',
  TIMETABLE_COORDINATOR = 'Timetable Coordinator',
  PLACEMENT_COORDINATOR = 'Placement Coordinator',
  RESEARCH_COORDINATOR = 'Research Coordinator',
  ACADEMIC_COORDINATOR = 'Academic Coordinator',
  LAB_INCHARGE = 'Laboratory In-charge',
  DEPARTMENT_SECRETARY = 'Department Secretary',
  COMMITTEE_MEMBER = 'Committee Member',
}

type AdministrativeRole = {
  id: number;
  academicYear: string;
  roleTitle: RoleTitle;
  hoursSpent: number;
};

const AdministrativeRolesPage = () => {
  // Example data - replace with actual data fetching
  const [roles, setRoles] = React.useState<AdministrativeRole[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      roleTitle: RoleTitle.CLASS_COORDINATOR,
      hoursSpent: 120,
    },
    {
      id: 2,
      academicYear: "2023-2024",
      roleTitle: RoleTitle.LAB_INCHARGE,
      hoursSpent: 80,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteAdministrativeRole(id);
      setRoles(roles.filter(role => role.id !== id));
    } catch (error) {
      console.error('Failed to delete role:', error);
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
                <Label htmlFor="academic_year">Academic Year</Label>
                <Input
                  type="text"
                  id="academic_year"
                  name="academic_year"
                  placeholder="e.g., 2023-2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_title">Role Title</Label>
                <Select name="role_title" required>
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
                <Label htmlFor="hours_spent">Hours Spent</Label>
                <Input
                  type="number"
                  id="hours_spent"
                  name="hours_spent"
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
              >
                Save Role
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
                    <TableCell className="text-right">{role.hoursSpent}</TableCell>
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
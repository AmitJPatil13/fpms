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

// Define enum for duty types
enum DutyType {
  PAPER_SETTING = 'Paper Setting',
  INVIGILATION = 'Invigilation',
  EVALUATION = 'Paper Evaluation',
  MODERATION = 'Paper Moderation',
  PRACTICAL_EXAM = 'Practical Examination',
  VIVA_VOCE = 'Viva Voce',
  SUPERVISION = 'Exam Supervision',
}

// Example type for duty record
type ExamDuty = {
  id: number;
  academicYear: string;
  dutyType: string;
  dutyDate: string;
  hoursSpent: number;
};

const ExamDutiesPage = () => {
  // Example data - replace with actual data fetching
  const [duties, setDuties] = React.useState<ExamDuty[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      dutyType: DutyType.INVIGILATION,
      dutyDate: "2024-01-15",
      hoursSpent: 3,
    },
    // Add more sample data
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteExamDuty(id);
      setDuties(duties.filter(duty => duty.id !== id));
    } catch (error) {
      console.error('Failed to delete exam duty:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Exam Duty</CardTitle>
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
                <Label htmlFor="duty_type">Duty Type</Label>
                <Select name="duty_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duty type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DutyType).map((duty) => (
                      <SelectItem key={duty} value={duty}>
                        {duty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duty_date">Duty Date</Label>
                <Input
                  type="date"
                  id="duty_date"
                  name="duty_date"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours_spent">Hours Spent</Label>
                <Input
                  type="number"
                  id="hours_spent"
                  name="hours_spent"
                  min="0"
                  placeholder="Enter total hours"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Exam Duty
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Exam Duties List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academic Year</TableHead>
                <TableHead>Duty Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Hours Spent</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duties.map((duty) => (
                <TableRow key={duty.id}>
                  <TableCell>{duty.academicYear}</TableCell>
                  <TableCell>{duty.dutyType}</TableCell>
                  <TableCell>{new Date(duty.dutyDate).toLocaleDateString()}</TableCell>
                  <TableCell>{duty.hoursSpent}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(duty.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamDutiesPage; 
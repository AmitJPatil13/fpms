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

// Example type for teaching activity record
type TeachingActivity = {
  id: number;
  academicYear: string;
  subjectName: string;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  extraHours: number;
};

const TeachingActivitiesPage = () => {
  // Example data - replace with actual data fetching
  const [activities, setActivities] = React.useState<TeachingActivity[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      subjectName: "Data Structures",
      lectureHours: 30,
      tutorialHours: 15,
      practicalHours: 30,
      extraHours: 5,
    },
    {
      id: 2,
      academicYear: "2023-2024",
      subjectName: "Database Management",
      lectureHours: 45,
      tutorialHours: 15,
      practicalHours: 30,
      extraHours: 0,
    },
    // Add more sample data as needed
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteTeachingActivity(id);
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Failed to delete teaching activity:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Teaching Activity</CardTitle>
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
                <Label htmlFor="subject_name">Subject Name</Label>
                <Input
                  type="text"
                  id="subject_name"
                  name="subject_name"
                  placeholder="Enter subject name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lecture_hours">Lecture Hours</Label>
                <Input
                  type="number"
                  id="lecture_hours"
                  name="lecture_hours"
                  min="0"
                  placeholder="Enter lecture hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tutorial_hours">Tutorial Hours</Label>
                <Input
                  type="number"
                  id="tutorial_hours"
                  name="tutorial_hours"
                  min="0"
                  placeholder="Enter tutorial hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="practical_hours">Practical Hours</Label>
                <Input
                  type="number"
                  id="practical_hours"
                  name="practical_hours"
                  min="0"
                  placeholder="Enter practical hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extra_hours">Extra Hours</Label>
                <Input
                  type="number"
                  id="extra_hours"
                  name="extra_hours"
                  min="0"
                  placeholder="Hours beyond UGC norms (if any)"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Activity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Subject Name</TableHead>
                  <TableHead className="text-right">Lecture Hours</TableHead>
                  <TableHead className="text-right">Tutorial Hours</TableHead>
                  <TableHead className="text-right">Practical Hours</TableHead>
                  <TableHead className="text-right">Extra Hours</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.academicYear}</TableCell>
                    <TableCell>{activity.subjectName}</TableCell>
                    <TableCell className="text-right">{activity.lectureHours}</TableCell>
                    <TableCell className="text-right">{activity.tutorialHours}</TableCell>
                    <TableCell className="text-right">{activity.practicalHours}</TableCell>
                    <TableCell className="text-right">{activity.extraHours}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(activity.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Add a summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={2}>Total Hours</TableCell>
                  <TableCell className="text-right">
                    {activities.reduce((sum, act) => sum + act.lectureHours, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce((sum, act) => sum + act.tutorialHours, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce((sum, act) => sum + act.practicalHours, 0)}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce((sum, act) => sum + act.extraHours, 0)}
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

export default TeachingActivitiesPage; 
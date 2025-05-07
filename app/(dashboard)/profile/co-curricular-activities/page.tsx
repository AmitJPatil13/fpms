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

// Define enums for activity types and levels
enum ActivityType {
  NSS = 'NSS',
  CLUB_MENTOR = 'Club Mentor',
  INDUSTRIAL_VISIT = 'Industrial Visit',
  SPORTS = 'Sports Coordinator',
  CULTURAL = 'Cultural Coordinator',
  TECHNICAL_CLUB = 'Technical Club',
  PLACEMENT_COORDINATOR = 'Placement Coordinator',
}

enum ActivityLevel {
  COLLEGE = 'College',
  STATE = 'State',
  NATIONAL = 'National',
  INTERNATIONAL = 'International',
}

type CoCurricularActivity = {
  id: number;
  academicYear: string;
  activityType: ActivityType;
  hoursSpent: number;
  level: ActivityLevel;
};

const CoCurricularActivitiesPage = () => {
  // Example data - replace with actual data fetching
  const [activities, setActivities] = React.useState<CoCurricularActivity[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      activityType: ActivityType.NSS,
      hoursSpent: 20,
      level: ActivityLevel.COLLEGE,
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
      // await deleteCoCurricularActivity(id);
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error('Failed to delete activity:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Co-curricular Activity</CardTitle>
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
                <Label htmlFor="activity_type">Activity Type</Label>
                <Select name="activity_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ActivityType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
                  placeholder="Enter total hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Activity Level</Label>
                <Select name="level" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ActivityLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <CardTitle>Co-curricular Activities List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Activity Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Hours Spent</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.academicYear}</TableCell>
                    <TableCell>{activity.activityType}</TableCell>
                    <TableCell>{activity.level}</TableCell>
                    <TableCell className="text-right">{activity.hoursSpent}</TableCell>
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
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={3}>Total Hours</TableCell>
                  <TableCell className="text-right">
                    {activities.reduce((sum, act) => sum + act.hoursSpent, 0)}
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

export default CoCurricularActivitiesPage; 
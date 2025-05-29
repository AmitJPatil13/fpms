"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  const [activities, setActivities] = React.useState<TeachingActivity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    subjectName: "",
    lectureHours: 0,
    tutorialHours: 0,
    practicalHours: 0,
    extraHours: 0,
  });

  // Fetch teaching activities on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/teaching-activities");
          const data = await response.json();
          if (data.success) {
            setActivities(data.activities);
          }
        } catch (error) {
          console.error("Failed to fetch teaching activities:", error);
          toast.error("Failed to load teaching activities");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Hours") ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to add teaching activities");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/teaching-activities", {
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
        setActivities((prev) => [...prev, data.activity]);
        setFormData({
          academicYear: "",
          subjectName: "",
          lectureHours: 0,
          tutorialHours: 0,
          practicalHours: 0,
          extraHours: 0,
        });
        toast.success("Teaching activity added successfully");
      } else {
        throw new Error(data.message || "Failed to add teaching activity");
      }
    } catch (error) {
      console.error("Failed to add teaching activity:", error);
      toast.error("Failed to add teaching activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete teaching activities");
      return;
    }

    try {
      const response = await fetch(`/api/teaching-activities/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setActivities(activities.filter((activity) => activity.id !== id));
        toast.success("Teaching activity deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete teaching activity");
      }
    } catch (error) {
      console.error("Failed to delete teaching activity:", error);
      toast.error("Failed to delete teaching activity");
    }
  };

  const calculateTotalHours = (activity: TeachingActivity) => {
    return (
      activity.lectureHours +
      activity.tutorialHours +
      activity.practicalHours +
      activity.extraHours
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Teaching Activity</CardTitle>
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
                <Label htmlFor="subjectName">Subject Name</Label>
                <Input
                  type="text"
                  id="subjectName"
                  name="subjectName"
                  value={formData.subjectName}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lectureHours">Lecture Hours</Label>
                <Input
                  type="number"
                  id="lectureHours"
                  name="lectureHours"
                  value={formData.lectureHours}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tutorialHours">Tutorial Hours</Label>
                <Input
                  type="number"
                  id="tutorialHours"
                  name="tutorialHours"
                  value={formData.tutorialHours}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="practicalHours">Practical Hours</Label>
                <Input
                  type="number"
                  id="practicalHours"
                  name="practicalHours"
                  value={formData.practicalHours}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraHours">Extra Hours</Label>
                <Input
                  type="number"
                  id="extraHours"
                  name="extraHours"
                  value={formData.extraHours}
                  onChange={handleInputChange}
                  min="0"
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
                {loading ? "Saving..." : "Add Activity"}
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
                  <TableHead className="text-right">Total Hours</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.academicYear}</TableCell>
                    <TableCell>{activity.subjectName}</TableCell>
                    <TableCell className="text-right">
                      {activity.lectureHours}
                    </TableCell>
                    <TableCell className="text-right">
                      {activity.tutorialHours}
                    </TableCell>
                    <TableCell className="text-right">
                      {activity.practicalHours}
                    </TableCell>
                    <TableCell className="text-right">
                      {activity.extraHours}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {calculateTotalHours(activity)}
                    </TableCell>
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
                  <TableCell colSpan={2}>Total Hours</TableCell>
                  <TableCell className="text-right">
                    {activities.reduce(
                      (sum, activity) => sum + activity.lectureHours,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce(
                      (sum, activity) => sum + activity.tutorialHours,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce(
                      (sum, activity) => sum + activity.practicalHours,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce(
                      (sum, activity) => sum + activity.extraHours,
                      0
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {activities.reduce(
                      (sum, activity) => sum + calculateTotalHours(activity),
                      0
                    )}
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
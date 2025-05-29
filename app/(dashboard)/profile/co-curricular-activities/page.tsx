"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

enum ActivityType {
  CLUB = "Club/Society",
  SPORTS = "Sports/Games",
  CULTURAL = "Cultural Event",
  SOCIAL = "Social Service",
  TECHNICAL = "Technical Event",
  COMMITTEE = "Committee Work",
  OTHER = "Other",
}

enum Level {
  DEPARTMENT = "Department",
  COLLEGE = "College",
  UNIVERSITY = "University",
  STATE = "State",
  NATIONAL = "National",
  INTERNATIONAL = "International",
}

type CoCurricularActivity = {
  id: number;
  academicYear: string;
  activityType: ActivityType;
  hoursSpent: number;
  level: Level;
};

const CoCurricularActivitiesPage = () => {
  const [activities, setActivities] = React.useState<CoCurricularActivity[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    activityType: "",
    hoursSpent: 0,
    level: "",
  });

  // Fetch activities on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/co-curricular-activities");
          const data = await response.json();
          if (data.success) {
            setActivities(data.activities);
          }
        } catch (error) {
          console.error("Failed to fetch co-curricular activities:", error);
          toast.error("Failed to load activities");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "hoursSpent" ? parseInt(value) || 0 : value,
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
      toast.error("Please sign in to add activities");
      return;
    }

    // Validate hours spent
    if (formData.hoursSpent < 0) {
      toast.error("Hours spent cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/co-curricular-activities", {
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
          activityType: "",
          hoursSpent: 0,
          level: "",
        });
        toast.success("Activity added successfully");
      } else {
        throw new Error(data.message || "Failed to add activity");
      }
    } catch (error) {
      console.error("Failed to add activity:", error);
      toast.error("Failed to add activity");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete activities");
      return;
    }

    try {
      const response = await fetch(`/api/co-curricular-activities/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setActivities(activities.filter((activity) => activity.id !== id));
        toast.success("Activity deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete activity");
      }
    } catch (error) {
      console.error("Failed to delete activity:", error);
      toast.error("Failed to delete activity");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Co-curricular Activity</CardTitle>
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
                  placeholder="e.g., 2023-24"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type</Label>
                <Select
                  name="activityType"
                  value={formData.activityType}
                  onValueChange={(value) => handleSelectChange("activityType", value)}
                  required
                >
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
                <Label htmlFor="level">Level</Label>
                <Select
                  name="level"
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange("level", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Level).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
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
                  placeholder="Enter hours spent"
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
                  <TableHead>Hours Spent</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.academicYear}</TableCell>
                    <TableCell>{activity.activityType}</TableCell>
                    <TableCell>{activity.level}</TableCell>
                    <TableCell>{activity.hoursSpent}</TableCell>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoCurricularActivitiesPage; 
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

enum EventType {
  WORKSHOP = "Workshop",
  CONFERENCE = "Conference",
  SEMINAR = "Seminar",
  TRAINING = "Training Program",
  CERTIFICATION = "Certification",
  COURSE = "Online Course",
  OTHER = "Other",
}

type ProfessionalDevelopment = {
  id: number;
  academicYear: string;
  eventType: EventType;
  eventTitle: string;
  durationDays: number;
  dateFrom: string;
  dateTo: string;
  organizedBy: string;
};

const ProfessionalDevelopmentPage = () => {
  const [activities, setActivities] = React.useState<ProfessionalDevelopment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    eventType: "",
    eventTitle: "",
    durationDays: 1,
    dateFrom: "",
    dateTo: "",
    organizedBy: "",
  });

  // Fetch activities on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/professional-development");
          const data = await response.json();
          if (data.success) {
            setActivities(data.activities);
          }
        } catch (error) {
          console.error("Failed to fetch professional development activities:", error);
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
      [name]: name === "durationDays" ? parseInt(value) || 1 : value,
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

    // Validate dates
    const fromDate = new Date(formData.dateFrom);
    const toDate = new Date(formData.dateTo);
    if (toDate < fromDate) {
      toast.error("End date cannot be earlier than start date");
      return;
    }

    // Validate duration
    if (formData.durationDays <= 0) {
      toast.error("Duration must be positive");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/professional-development", {
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
          eventType: "",
          eventTitle: "",
          durationDays: 1,
          dateFrom: "",
          dateTo: "",
          organizedBy: "",
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
      const response = await fetch(`/api/professional-development/${id}`, {
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
          <CardTitle>Add Professional Development Activity</CardTitle>
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
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  name="eventType"
                  value={formData.eventType}
                  onValueChange={(value) => handleSelectChange("eventType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EventType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventTitle">Event Title</Label>
                <Input
                  type="text"
                  id="eventTitle"
                  name="eventTitle"
                  value={formData.eventTitle}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizedBy">Organized By</Label>
                <Input
                  type="text"
                  id="organizedBy"
                  name="organizedBy"
                  value={formData.organizedBy}
                  onChange={handleInputChange}
                  placeholder="Enter organizer name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFrom">Start Date</Label>
                <Input
                  type="date"
                  id="dateFrom"
                  name="dateFrom"
                  value={formData.dateFrom}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateTo">End Date</Label>
                <Input
                  type="date"
                  id="dateTo"
                  name="dateTo"
                  value={formData.dateTo}
                  onChange={handleInputChange}
                  min={formData.dateFrom}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationDays">Duration (Days)</Label>
                <Input
                  type="number"
                  id="durationDays"
                  name="durationDays"
                  value={formData.durationDays}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Enter duration in days"
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
          <CardTitle>Professional Development Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Organized By</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.academicYear}</TableCell>
                    <TableCell className="font-medium">
                      {activity.eventTitle}
                    </TableCell>
                    <TableCell>{activity.eventType}</TableCell>
                    <TableCell>{activity.organizedBy}</TableCell>
                    <TableCell>
                      {activity.durationDays} day{activity.durationDays > 1 ? 's' : ''} 
                      <span className="text-gray-500 text-sm ml-2">
                        ({new Date(activity.dateFrom).toLocaleDateString()} - {new Date(activity.dateTo).toLocaleDateString()})
                      </span>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDevelopmentPage; 
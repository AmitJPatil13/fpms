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
import { toast } from "sonner";

// Define enums for department and designation
enum Department {
  COMPUTER_SCIENCE = "Computer Science",
  ELECTRICAL = "Electrical Engineering",
  MECHANICAL = "Mechanical Engineering",
  CIVIL = "Civil Engineering",
  // Add more departments as needed
}

enum Designation {
  ASSISTANT_PROFESSOR = "Asst. Prof",
  ASSOCIATE_PROFESSOR = "Assoc. Prof",
  PROFESSOR = "Professor",
  // Add more designations as needed
}

interface FacultyInfo {
  name: string;
  email: string;
  department: Department;
  designation: Designation;
  joining_date: string;
  phone: string;
}

const BasicInfoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [facultyInfo, setFacultyInfo] = React.useState<FacultyInfo | null>(
    null
  );
  const [isEditing, setIsEditing] = React.useState(false);

  // Fetch faculty info on component mount
  React.useEffect(() => {
    const fetchFacultyInfo = async () => {
      try {
        const response = await fetch("/api/faculty/basic-info");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        if (data) {
          setFacultyInfo(data);
          setIsEditing(false);
        } else {
          setIsEditing(true); // Enable editing if no data exists
        }
      } catch (error) {
        console.error("Error fetching faculty info:", error);
        toast.error("Failed to load faculty information");
      }
    };

    fetchFacultyInfo();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        department: formData.get("department"),
        designation: formData.get("designation"),
        joining_date: formData.get("joining_date"),
        phone: formData.get("phone"),
      };

      const method = facultyInfo ? "PUT" : "POST";
      const response = await fetch("/api/faculty/basic-info", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save");

      const savedData = await response.json();
      setFacultyInfo(savedData);
      setIsEditing(false);

      toast.success("Faculty information saved successfully");
    } catch (error) {
      console.error("Error saving faculty info:", error);
      toast.error("Failed to save faculty information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Basic Information</CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={facultyInfo?.name || ""}
                disabled={true} // Name comes from user table
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                name="department"
                value={facultyInfo?.department}
                disabled={!isEditing}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Department).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Select
                name="designation"
                value={facultyInfo?.designation}
                disabled={!isEditing}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Designation" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Designation).map((desig) => (
                    <SelectItem key={desig} value={desig}>
                      {desig}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="joining_date">Joining Date</Label>
              <Input
                type="date"
                id="joining_date"
                name="joining_date"
                value={facultyInfo?.joining_date || ""}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={facultyInfo?.email || ""}
                disabled={true} // Email comes from user table
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={facultyInfo?.phone || ""}
                disabled={!isEditing}
                required
              />
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="!bg-blue-500 text-white hover:!bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Information"}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoPage;

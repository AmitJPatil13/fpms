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

enum DutyType {
  INVIGILATOR = "Invigilator",
  SQUAD = "Flying Squad",
  EXAMINER = "Examiner",
  PAPER_SETTER = "Paper Setter",
  EVALUATOR = "Evaluator",
  COORDINATOR = "Exam Coordinator",
  MODERATOR = "Moderator",
}

type ExamDuty = {
  id: number;
  academicYear: string;
  dutyType: DutyType;
  dutyDate: string;
  hoursSpent: number;
};

const ExamDutiesPage = () => {
  const [duties, setDuties] = React.useState<ExamDuty[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    dutyType: "",
    dutyDate: "",
    hoursSpent: 0,
  });

  // Fetch duties on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/exam-duties");
          const data = await response.json();
          if (data.success) {
            setDuties(data.duties);
          }
        } catch (error) {
          console.error("Failed to fetch exam duties:", error);
          toast.error("Failed to load duties");
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
      [name]: name === "hoursSpent" ? (value ? parseInt(value) : 0) : value,
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
      toast.error("Please sign in to add duties");
      return;
    }

    // Validate hours spent
    if (formData.hoursSpent < 0) {
      toast.error("Hours spent cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/exam-duties", {
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
        setDuties((prev) => [...prev, data.duty]);
        setFormData({
          academicYear: "",
          dutyType: "",
          dutyDate: "",
          hoursSpent: 0,
        });
        toast.success("Duty added successfully");
      } else {
        throw new Error(data.message || "Failed to add duty");
      }
    } catch (error) {
      console.error("Failed to add duty:", error);
      toast.error("Failed to add duty");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete duties");
      return;
    }

    try {
      const response = await fetch(`/api/exam-duties/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setDuties(duties.filter((duty) => duty.id !== id));
        toast.success("Duty deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete duty");
      }
    } catch (error) {
      console.error("Failed to delete duty:", error);
      toast.error("Failed to delete duty");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Exam Duty</CardTitle>
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
                <Label htmlFor="dutyType">Duty Type</Label>
                <Select
                  name="dutyType"
                  value={formData.dutyType}
                  onValueChange={(value) => handleSelectChange("dutyType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duty type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DutyType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dutyDate">Date</Label>
                <Input
                  type="date"
                  id="dutyDate"
                  name="dutyDate"
                  value={formData.dutyDate}
                  onChange={handleInputChange}
                  required
                />
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
                {loading ? "Saving..." : "Add Duty"}
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
          <div className="overflow-x-auto">
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
                    <TableCell>
                      {new Date(duty.dutyDate).toLocaleDateString()}
                    </TableCell>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamDutiesPage; 
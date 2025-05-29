"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

enum Degree {
  PHD = "Ph.D.",
  MTECH = "M.Tech.",
  BTECH = "B.Tech.",
  OTHER = "Other",
}

enum GuidanceStatus {
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  DISCONTINUED = "Discontinued",
}

type ResearchGuidance = {
  id: number;
  scholarName: string;
  degree: string;
  status: string;
  year: number;
};

const ResearchGuidancePage = () => {
  const [guidances, setGuidances] = React.useState<ResearchGuidance[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    scholarName: "",
    degree: "",
    status: "",
    year: new Date().getFullYear(),
  });

  // Fetch guidances on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/research-guidance");
          const data = await response.json();
          if (data.success) {
            setGuidances(data.guidances);
          }
        } catch (error) {
          console.error("Failed to fetch research guidances:", error);
          toast.error("Failed to load research guidances");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Year") ? (value ? parseInt(value) : undefined) : value,
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
      toast.error("Please sign in to add research guidance");
      return;
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (formData.year < 1900 || formData.year > currentYear) {
      toast.error("Invalid year");
      return;
    }

    // Validate string lengths
    if (formData.scholarName.length > 255) {
      toast.error("Scholar name too long (max 255 characters)");
      return;
    }

    if (formData.degree.length > 50) {
      toast.error("Degree too long (max 50 characters)");
      return;
    }

    if (formData.status.length > 50) {
      toast.error("Status too long (max 50 characters)");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/research-guidance", {
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
        setGuidances((prev) => [...prev, data.guidance]);
        setFormData({
          scholarName: "",
          degree: "",
          status: "",
          year: new Date().getFullYear(),
        });
        toast.success("Research guidance added successfully");
      } else {
        throw new Error(data.message || "Failed to add research guidance");
      }
    } catch (error) {
      console.error("Failed to add research guidance:", error);
      toast.error("Failed to add research guidance");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete research guidance");
      return;
    }

    try {
      const response = await fetch(`/api/research-guidance/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setGuidances(guidances.filter((guidance) => guidance.id !== id));
        toast.success("Research guidance deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete research guidance");
      }
    } catch (error) {
      console.error("Failed to delete research guidance:", error);
      toast.error("Failed to delete research guidance");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Research Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scholarName">Scholar Name</Label>
                <Input
                  type="text"
                  id="scholarName"
                  name="scholarName"
                  value={formData.scholarName}
                  onChange={handleInputChange}
                  placeholder="Enter scholar name"
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Select
                  name="degree"
                  value={formData.degree}
                  onValueChange={(value) => handleSelectChange("degree", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Degree).map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(GuidanceStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min={1900}
                  max={new Date().getFullYear()}
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
                {loading ? "Saving..." : "Add Guidance"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Guidance List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholar Name</TableHead>
                  <TableHead>Degree</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guidances.map((guidance) => (
                  <TableRow key={guidance.id}>
                    <TableCell className="font-medium">
                      {guidance.scholarName}
                    </TableCell>
                    <TableCell>{guidance.degree}</TableCell>
                    <TableCell>{guidance.status}</TableCell>
                    <TableCell>{guidance.year}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(guidance.id)}
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

export default ResearchGuidancePage; 
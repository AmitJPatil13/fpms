"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type TeachingInnovation = {
  id: number;
  academicYear: string;
  description: string;
  hoursSpent: number;
  toolUsed: string;
};

const TeachingInnovationsPage = () => {
  const [innovations, setInnovations] = React.useState<TeachingInnovation[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    academicYear: "",
    description: "",
    hoursSpent: 0,
    toolUsed: "",
  });

  // Fetch innovations on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/teaching-innovations");
          const data = await response.json();
          if (data.success) {
            setInnovations(data.innovations);
          }
        } catch (error) {
          console.error("Failed to fetch teaching innovations:", error);
          toast.error("Failed to load teaching innovations");
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
      [name]: name === "hoursSpent" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to add teaching innovations");
      return;
    }

    // Validate hours spent
    if (formData.hoursSpent < 0) {
      toast.error("Hours spent cannot be negative");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/teaching-innovations", {
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
        setInnovations((prev) => [...prev, data.innovation]);
        setFormData({
          academicYear: "",
          description: "",
          hoursSpent: 0,
          toolUsed: "",
        });
        toast.success("Teaching innovation added successfully");
      } else {
        throw new Error(data.message || "Failed to add teaching innovation");
      }
    } catch (error) {
      console.error("Failed to add teaching innovation:", error);
      toast.error("Failed to add teaching innovation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete teaching innovations");
      return;
    }

    try {
      const response = await fetch(`/api/teaching-innovations/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setInnovations(innovations.filter((innovation) => innovation.id !== id));
        toast.success("Teaching innovation deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete teaching innovation");
      }
    } catch (error) {
      console.error("Failed to delete teaching innovation:", error);
      toast.error("Failed to delete teaching innovation");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Teaching Innovation</CardTitle>
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
                <Label htmlFor="toolUsed">Tool/Technology Used</Label>
                <Input
                  type="text"
                  id="toolUsed"
                  name="toolUsed"
                  value={formData.toolUsed}
                  onChange={handleInputChange}
                  placeholder="Enter tool or technology used"
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the teaching innovation and its impact..."
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Innovation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Innovations List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Tool Used</TableHead>
                  <TableHead>Hours Spent</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {innovations.map((innovation) => (
                  <TableRow key={innovation.id}>
                    <TableCell>{innovation.academicYear}</TableCell>
                    <TableCell>{innovation.toolUsed}</TableCell>
                    <TableCell>{innovation.hoursSpent}</TableCell>
                    <TableCell className="max-w-md truncate">
                      {innovation.description}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(innovation.id)}
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

export default TeachingInnovationsPage; 
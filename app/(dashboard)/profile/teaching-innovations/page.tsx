"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Trash2 } from "lucide-react"; // Import icon from lucide-react

// Define common teaching tools
enum TeachingTool {
  POWERPOINT = 'PowerPoint',
  LMS = 'Learning Management System',
  VIRTUAL_LAB = 'Virtual Lab',
  SIMULATION = 'Simulation Software',
  VIDEO = 'Video Content',
  INTERACTIVE_QUIZ = 'Interactive Quiz',
  ONLINE_WHITEBOARD = 'Online Whiteboard',
  COLLABORATIVE_TOOLS = 'Collaborative Tools',
  OTHER = 'Other'
}

// Example type for innovation record
type Innovation = {
  id: number;
  academicYear: string;
  description: string;
  hoursSpent: number;
  toolUsed: string;
};

const TeachingInnovationsPage = () => {
  // Example data - replace with actual data fetching
  const [innovations, setInnovations] = React.useState<Innovation[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      description: "Implemented virtual lab simulations",
      hoursSpent: 20,
      toolUsed: TeachingTool.VIRTUAL_LAB,
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
      // await deleteInnovation(id);
      setInnovations(innovations.filter(inn => inn.id !== id));
    } catch (error) {
      console.error('Failed to delete innovation:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Teaching Innovation</CardTitle>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="tool_used">Teaching Tool Used</Label>
                <Select name="tool_used" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teaching tool" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TeachingTool).map((tool) => (
                      <SelectItem key={tool} value={tool}>
                        {tool}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description of Innovation</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your teaching innovation in detail..."
                  className="min-h-[150px] resize-y"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Innovation
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Academic Year</TableHead>
                <TableHead>Tool Used</TableHead>
                <TableHead className="max-w-[300px]">Description</TableHead>
                <TableHead>Hours Spent</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {innovations.map((innovation) => (
                <TableRow key={innovation.id}>
                  <TableCell>{innovation.academicYear}</TableCell>
                  <TableCell>{innovation.toolUsed}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {innovation.description}
                  </TableCell>
                  <TableCell>{innovation.hoursSpent}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default TeachingInnovationsPage; 
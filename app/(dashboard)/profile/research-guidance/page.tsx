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

enum DegreeType {
  MPHIL = 'M.Phil',
  PHD = 'Ph.D.',
}

enum ThesisStatus {
  AWARDED = 'Awarded',
  SUBMITTED = 'Submitted',
  ONGOING = 'Ongoing',
}

type ResearchGuidance = {
  id: number;
  scholarName: string;
  degree: DegreeType;
  status: ThesisStatus;
  year: number;
};

const ResearchGuidancePage = () => {
  // Example data - replace with actual data fetching
  const [guidances, setGuidances] = React.useState<ResearchGuidance[]>([
    {
      id: 1,
      scholarName: "John Doe",
      degree: DegreeType.PHD,
      status: ThesisStatus.AWARDED,
      year: 2023,
    },
  ]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [filters, setFilters] = React.useState({
    degree: '',
    status: '',
    year: '',
  });

  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredGuidances = guidances.filter(guidance => {
    if (filters.degree && guidance.degree !== filters.degree) return false;
    if (filters.status && guidance.status !== filters.status) return false;
    if (filters.year && guidance.year.toString() !== filters.year) return false;
    return true;
  });

  const searchedGuidances = guidances.filter(guidance =>
    guidance.scholarName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteGuidance(id);
      setGuidances(guidances.filter(guidance => guidance.id !== id));
    } catch (error) {
      console.error('Failed to delete guidance record:', error);
    }
  };

  const exportData = () => {
    const headers = ['Scholar Name', 'Degree', 'Status', 'Year'];
    const data = guidances.map(g => [
      g.scholarName,
      g.degree,
      g.status,
      g.year.toString()
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'research-guidance.csv';
    a.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Research Scholar</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="scholar_name">Scholar Name</Label>
                <Input
                  type="text"
                  id="scholar_name"
                  name="scholar_name"
                  placeholder="Enter scholar's full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Select name="degree" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(DegreeType).map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ThesisStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Select name="year" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
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
                Add Scholar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Scholars List</CardTitle>
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
                {filteredGuidances.map((guidance) => (
                  <TableRow key={guidance.id}>
                    <TableCell>{guidance.scholarName}</TableCell>
                    <TableCell>{guidance.degree}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        guidance.status === ThesisStatus.AWARDED
                          ? "bg-green-100 text-green-800"
                          : guidance.status === ThesisStatus.SUBMITTED
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {guidance.status}
                      </span>
                    </TableCell>
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

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {guidances.length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Total Scholars
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {guidances.filter(g => g.status === ThesisStatus.AWARDED).length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Awarded
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {guidances.filter(g => g.status === ThesisStatus.SUBMITTED).length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Submitted
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    {guidances.filter(g => g.status === ThesisStatus.ONGOING).length}
                  </div>
                  <div className="text-sm text-gray-500">
                    Ongoing
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchGuidancePage; 
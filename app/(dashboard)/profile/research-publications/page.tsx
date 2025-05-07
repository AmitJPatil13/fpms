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

enum PublicationType {
  JOURNAL = 'Journal Paper',
  CONFERENCE = 'Conference Paper',
  BOOK = 'Book',
  BOOK_CHAPTER = 'Book Chapter',
  PATENT = 'Patent',
}

enum PublicationLevel {
  NATIONAL = 'National',
  INTERNATIONAL = 'International',
}

type Publication = {
  id: number;
  title: string;
  publicationType: PublicationType;
  journalName: string;
  issnIsbn: string;
  impactFactor: number;
  datePublished: string;
  level: PublicationLevel;
};

const ResearchPublicationsPage = () => {
  // Example data - replace with actual data fetching
  const [publications, setPublications] = React.useState<Publication[]>([
    {
      id: 1,
      title: "Machine Learning Applications in Education",
      publicationType: PublicationType.JOURNAL,
      journalName: "International Journal of Educational Technology",
      issnIsbn: "1234-5678",
      impactFactor: 3.5,
      datePublished: "2024-01-15",
      level: PublicationLevel.INTERNATIONAL,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deletePublication(id);
      setPublications(publications.filter(pub => pub.id !== id));
    } catch (error) {
      console.error('Failed to delete publication:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Title', 'Type', 'Journal/Book', 'ISSN/ISBN', 'Impact Factor', 'Level', 'Date'];
    const data = publications.map(pub => [
      pub.title,
      pub.publicationType,
      pub.journalName,
      pub.issnIsbn,
      pub.impactFactor,
      pub.level,
      new Date(pub.datePublished).toLocaleDateString()
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'publications.csv';
    a.click();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Research Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Publication Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter publication title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publication_type">Publication Type</Label>
                <Select name="publication_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select publication type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PublicationType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Publication Level</Label>
                <Select name="level" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PublicationLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="journal_name">Journal/Book Name</Label>
                <Input
                  type="text"
                  id="journal_name"
                  name="journal_name"
                  placeholder="Enter journal or book name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issn_isbn">ISSN/ISBN</Label>
                <Input
                  type="text"
                  id="issn_isbn"
                  name="issn_isbn"
                  placeholder="Enter ISSN or ISBN number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impact_factor">Impact Factor</Label>
                <Input
                  type="number"
                  id="impact_factor"
                  name="impact_factor"
                  step="0.01"
                  min="0"
                  placeholder="Enter impact factor if applicable"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_published">Publication Date</Label>
                <Input
                  type="date"
                  id="date_published"
                  name="date_published"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Publication
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Research Publications List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Journal/Book</TableHead>
                  <TableHead>ISSN/ISBN</TableHead>
                  <TableHead className="text-right">Impact Factor</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications.map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell className="max-w-[300px] truncate">
                      {pub.title}
                    </TableCell>
                    <TableCell>{pub.publicationType}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {pub.journalName}
                    </TableCell>
                    <TableCell>{pub.issnIsbn}</TableCell>
                    <TableCell className="text-right">
                      {pub.impactFactor.toFixed(2)}
                    </TableCell>
                    <TableCell>{pub.level}</TableCell>
                    <TableCell>
                      {new Date(pub.datePublished).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(pub.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={2}>Total Publications: {publications.length}</TableCell>
                  <TableCell colSpan={3}>
                    Average Impact Factor: {
                      (publications.reduce((sum, pub) => sum + pub.impactFactor, 0) / publications.length || 0).toFixed(2)
                    }
                  </TableCell>
                  <TableCell colSpan={3}></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPublicationsPage; 
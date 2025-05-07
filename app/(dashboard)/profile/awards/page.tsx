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
import { Trash2, Trophy, Mic, Award } from "lucide-react";

enum EntryType {
  AWARD = 'Award',
  LECTURE = 'Lecture',
  HONOR = 'Honor',
}

enum RecognitionLevel {
  COLLEGE = 'College',
  STATE = 'State',
  NATIONAL = 'National',
  INTERNATIONAL = 'International',
}

type AwardEntry = {
  id: number;
  entryType: EntryType;
  title: string;
  date: string;
  level: RecognitionLevel;
};

const AwardsPage = () => {
  // Example data - replace with actual data fetching
  const [entries, setEntries] = React.useState<AwardEntry[]>([
    {
      id: 1,
      entryType: EntryType.AWARD,
      title: "Best Teacher Award",
      date: "2024-01-15",
      level: RecognitionLevel.COLLEGE,
    },
  ]);

  const [selectedYear, setSelectedYear] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState('');

  const yearOptions = Array.from(
    new Set(entries.map(e => new Date(e.date).getFullYear()))
  ).sort((a, b) => b - a);

  const filteredEntries = selectedYear
    ? entries.filter(e => new Date(e.date).getFullYear().toString() === selectedYear)
    : entries;

  const searchedEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof AwardEntry;
    direction: 'asc' | 'desc';
  }>();

  const sortedEntries = React.useMemo(() => {
    if (!sortConfig) return entries;
    
    return [...entries].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [entries, sortConfig]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  // Get icon based on entry type
  const getEntryIcon = (type: EntryType) => {
    switch (type) {
      case EntryType.AWARD:
        return <Trophy className="h-4 w-4" />;
      case EntryType.LECTURE:
        return <Mic className="h-4 w-4" />;
      case EntryType.HONOR:
        return <Award className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Award/Lecture/Honor</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entry_type">Type</Label>
                <Select name="entry_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EntryType).map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center gap-2">
                          {getEntryIcon(type)}
                          {type}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level</Label>
                <Select name="level" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RecognitionLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter title of award/lecture/honor"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Entry
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Awards, Lectures & Honors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntryIcon(entry.entryType)}
                        {entry.entryType}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {entry.title}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        entry.level === RecognitionLevel.INTERNATIONAL
                          ? "bg-purple-100 text-purple-800"
                          : entry.level === RecognitionLevel.NATIONAL
                          ? "bg-blue-100 text-blue-800"
                          : entry.level === RecognitionLevel.STATE
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {entry.level}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(entry.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {Object.values(EntryType).map((type) => (
                <Card key={type}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      {getEntryIcon(type)}
                      <div>
                        <div className="text-2xl font-bold">
                          {entries.filter(e => e.entryType === type).length}
                        </div>
                        <div className="text-sm text-gray-500">
                          Total {type}s
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AwardsPage; 
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

// Define enum for event types
enum EventType {
  SEMINAR = 'Seminar',
  FDP = 'Faculty Development Program',
  WORKSHOP = 'Workshop',
  CONFERENCE = 'Conference',
  TRAINING = 'Training Program',
  CERTIFICATION = 'Certification Course',
  MOOC = 'MOOC Course',
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
  // Example data - replace with actual data fetching
  const [events, setEvents] = React.useState<ProfessionalDevelopment[]>([
    {
      id: 1,
      academicYear: "2023-2024",
      eventType: EventType.FDP,
      eventTitle: "Advanced Machine Learning Techniques",
      durationDays: 5,
      dateFrom: "2024-01-15",
      dateTo: "2024-01-19",
      organizedBy: "IIT Bombay",
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteProfessionalDevelopment(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Professional Development Activity</CardTitle>
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
                <Label htmlFor="event_type">Event Type</Label>
                <Select name="event_type" required>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="event_title">Event Title</Label>
                <Input
                  type="text"
                  id="event_title"
                  name="event_title"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_from">Start Date</Label>
                <Input
                  type="date"
                  id="date_from"
                  name="date_from"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_to">End Date</Label>
                <Input
                  type="date"
                  id="date_to"
                  name="date_to"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_days">Duration (Days)</Label>
                <Input
                  type="number"
                  id="duration_days"
                  name="duration_days"
                  min="1"
                  placeholder="Number of days"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organized_by">Organized By</Label>
                <Input
                  type="text"
                  id="organized_by"
                  name="organized_by"
                  placeholder="Institute/University name"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Event
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
                  <TableHead>Event Type</TableHead>
                  <TableHead>Event Title</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Organized By</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.academicYear}</TableCell>
                    <TableCell>{event.eventType}</TableCell>
                    <TableCell>{event.eventTitle}</TableCell>
                    <TableCell>{event.durationDays} days</TableCell>
                    <TableCell>
                      {new Date(event.dateFrom).toLocaleDateString()} - {new Date(event.dateTo).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{event.organizedBy}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={3}>Total Days</TableCell>
                  <TableCell>
                    {events.reduce((sum, event) => sum + event.durationDays, 0)} days
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

export default ProfessionalDevelopmentPage; 
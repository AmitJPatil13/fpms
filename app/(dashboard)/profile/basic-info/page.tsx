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

const BasicInfoPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input type="text" id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select name="department" required>
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
              <Select name="designation" required>
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" id="email" name="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input type="tel" id="phone" name="phone" required />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Information
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoPage;

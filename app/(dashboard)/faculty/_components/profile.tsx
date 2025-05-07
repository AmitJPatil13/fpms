"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

interface FacultyProfileProps {
  isCompleted?: boolean;
}

export const FacultyProfile = ({
  isCompleted = false,
}: FacultyProfileProps) => {
  if (!isCompleted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please complete your profile to access all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Incomplete Profile</AlertTitle>
            <AlertDescription>
              Your profile is incomplete. This may limit your access to certain
              features.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/profile">
              <Button>Complete Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Faculty Profile</CardTitle>
        <CardDescription>Your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Profile content will go here when profile is completed */}
        <div className="space-y-4">
          <p>Profile content will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

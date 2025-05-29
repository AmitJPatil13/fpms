"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { getSession } from "redshield";
import { toast } from "sonner";

type BasicInfo = {
  id: number;
  department: string;
  designation: string;
  isHod: boolean;
  bio: string;
};

const BasicInfoPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState<BasicInfo>({
    id: 0,
    department: "",
    designation: "",
    isHod: false,
    bio: "",
  });

  // Fetch basic info on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/basic-info");
          const data = await response.json();
          if (data.success && data.basicInfo) {
            setFormData(data.basicInfo);
          }
        } catch (error) {
          console.error("Failed to fetch basic info:", error);
          toast.error("Failed to load basic information");
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
      [name]: value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isHod: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to update basic information");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/basic-info", {
        method: formData.id ? "PUT" : "POST",
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
        setFormData(data.basicInfo);
        toast.success("Basic information updated successfully");
      } else {
        throw new Error(data.message || "Failed to update basic information");
      }
    } catch (error) {
      console.error("Failed to update basic info:", error);
      toast.error("Failed to update basic information");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  type="text"
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g., Assistant Professor"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHod"
                  checked={formData.isHod}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isHod">Head of Department</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Write a brief bio about yourself..."
                className="min-h-[150px]"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInfoPage;

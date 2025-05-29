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

enum AwardLevel {
  INTERNATIONAL = "International",
  NATIONAL = "National",
  STATE = "State",
  UNIVERSITY = "University",
  INSTITUTE = "Institute",
}

enum EntryType {
  RESEARCH = "Research Excellence",
  TEACHING = "Teaching Excellence",
  INNOVATION = "Innovation",
  LEADERSHIP = "Leadership",
  SERVICE = "Service Excellence",
  LIFETIME = "Lifetime Achievement",
  OTHER = "Other",
}

type Award = {
  id: number;
  title: string;
  entryType: string;
  level: string;
  date: string;
};

const AwardsPage = () => {
  const [awards, setAwards] = React.useState<Award[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    entryType: "",
    level: "",
    date: "",
  });

  // Fetch awards on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/awards");
          const data = await response.json();
          if (data.success) {
            setAwards(data.awards);
          }
        } catch (error) {
          console.error("Failed to fetch awards:", error);
          toast.error("Failed to load awards");
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to add awards");
      return;
    }

    // Validate string lengths
    if (formData.title.length > 255) {
      toast.error("Title too long (max 255 characters)");
      return;
    }

    if (formData.entryType.length > 50) {
      toast.error("Entry type too long (max 50 characters)");
      return;
    }

    if (formData.level.length > 50) {
      toast.error("Level too long (max 50 characters)");
      return;
    }

    // Validate date
    const awardDate = new Date(formData.date);
    const currentDate = new Date();
    if (awardDate > currentDate) {
      toast.error("Award date cannot be in the future");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/awards", {
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
        setAwards((prev) => [...prev, data.award]);
        setFormData({
          title: "",
          entryType: "",
          level: "",
          date: "",
        });
        toast.success("Award added successfully");
      } else {
        throw new Error(data.message || "Failed to add award");
      }
    } catch (error) {
      console.error("Failed to add award:", error);
      toast.error("Failed to add award");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete awards");
      return;
    }

    try {
      const response = await fetch(`/api/awards/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setAwards(awards.filter((award) => award.id !== id));
        toast.success("Award deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete award");
      }
    } catch (error) {
      console.error("Failed to delete award:", error);
      toast.error("Failed to delete award");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Award</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Award Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter award title"
                  maxLength={255}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entryType">Entry Type</Label>
                <Select
                  name="entryType"
                  value={formData.entryType}
                  onValueChange={(value) => handleSelectChange("entryType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(EntryType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Award Level</Label>
                <Select
                  name="level"
                  value={formData.level}
                  onValueChange={(value) => handleSelectChange("level", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AwardLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Award Date</Label>
                <Input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
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
                {loading ? "Saving..." : "Add Award"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Awards List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Entry Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {awards.map((award) => (
                  <TableRow key={award.id}>
                    <TableCell className="font-medium">
                      {award.title}
                    </TableCell>
                    <TableCell>{award.entryType}</TableCell>
                    <TableCell>{award.level}</TableCell>
                    <TableCell>
                      {new Date(award.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(award.id)}
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

export default AwardsPage; 
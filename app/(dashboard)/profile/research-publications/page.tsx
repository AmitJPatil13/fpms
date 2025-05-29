"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

type ResearchPublication = {
  id: number;
  title: string;
  publicationType: string;
  journalName: string;
  issnIsbn?: string;
  impactFactor?: number;
  datePublished: string;
  level: string;
};

const publicationTypes = [
  "Journal Article",
  "Conference Paper",
  "Book Chapter",
  "Book",
  "Patent",
  "Other",
];

const publicationLevels = [
  "International",
  "National",
  "Regional",
  "Local",
];

const ResearchPublicationsPage = () => {
  const [publications, setPublications] = React.useState<ResearchPublication[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    title: "",
    publicationType: "",
    journalName: "",
    issnIsbn: "",
    impactFactor: 0,
    datePublished: "",
    level: "",
  });

  // Fetch publications on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch("/api/research-publications");
          const data = await response.json();
          if (data.success) {
            setPublications(data.publications);
          }
        } catch (error) {
          console.error("Failed to fetch publications:", error);
          toast.error("Failed to load research publications");
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "impactFactor") {
      const parsed = parseFloat(value);
      if (isNaN(parsed)) {
        setFormData(prev => ({ ...prev, impactFactor: 0 }));
      } else {
        setFormData(prev => ({ ...prev, impactFactor: Math.min(Math.max(parsed, 0), 99.99) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
      toast.error("Please sign in to add publications");
      return;
    }

    // Validate impact factor
    if (formData.impactFactor < 0) {
      toast.error("Impact factor must be non-negative");
      return;
    }

    if (formData.impactFactor > 99.99) {
      toast.error("Impact factor cannot exceed 99.99");
      return;
    }

    // Validate publication date
    const publishedDate = new Date(formData.datePublished);
    const currentDate = new Date();
    if (publishedDate > currentDate) {
      toast.error("Publication date cannot be in the future");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/research-publications", {
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
        setPublications((prev) => [...prev, data.publication]);
        setFormData({
          title: "",
          publicationType: "",
          journalName: "",
          issnIsbn: "",
          impactFactor: 0,
          datePublished: "",
          level: "",
        });
        toast.success("Publication added successfully");
      } else {
        throw new Error(data.message || "Failed to add publication");
      }
    } catch (error) {
      console.error("Failed to add publication:", error);
      toast.error("Failed to add publication");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error("Please sign in to delete publications");
      return;
    }

    try {
      const response = await fetch(`/api/research-publications/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setPublications(publications.filter((pub) => pub.id !== id));
        toast.success("Publication deleted successfully");
      } else {
        throw new Error(data.message || "Failed to delete publication");
      }
    } catch (error) {
      console.error("Failed to delete publication:", error);
      toast.error("Failed to delete publication");
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Research Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Publication Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter publication title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="publicationType">Publication Type</Label>
                <Select
                  name="publicationType"
                  value={formData.publicationType}
                  onValueChange={(value) =>
                    handleSelectChange("publicationType", value)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {publicationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="journalName">Journal/Conference Name</Label>
                <Input
                  type="text"
                  id="journalName"
                  name="journalName"
                  value={formData.journalName}
                  onChange={handleInputChange}
                  placeholder="Enter journal or conference name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Publication Level</Label>
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
                    {publicationLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="datePublished">Publication Date</Label>
                <Input
                  type="date"
                  id="datePublished"
                  name="datePublished"
                  value={formData.datePublished}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issnIsbn">ISSN/ISBN</Label>
                <Input
                  type="text"
                  id="issnIsbn"
                  name="issnIsbn"
                  value={formData.issnIsbn}
                  onChange={handleInputChange}
                  placeholder="Enter ISSN or ISBN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impactFactor">Impact Factor</Label>
                <Input
                  type="number"
                  id="impactFactor"
                  name="impactFactor"
                  value={formData.impactFactor}
                  onChange={handleInputChange}
                  min="0"
                  max="99.99"
                  step="0.01"
                  placeholder="Enter impact factor (max 99.99)"
                />
                <span className="text-sm text-gray-500">
                  Maximum value: 99.99
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Publication"}
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
                  <TableHead>Journal/Conference</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Date Published</TableHead>
                  <TableHead>Impact Factor</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publications.map((pub) => (
                  <TableRow key={pub.id}>
                    <TableCell className="font-medium">
                      {pub.title}
                    </TableCell>
                    <TableCell>{pub.publicationType}</TableCell>
                    <TableCell>{pub.journalName}</TableCell>
                    <TableCell>{pub.level}</TableCell>
                    <TableCell>
                      {new Date(pub.datePublished).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {typeof pub.impactFactor === 'number' 
                        ? pub.impactFactor.toFixed(2) 
                        : "-"}
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchPublicationsPage; 
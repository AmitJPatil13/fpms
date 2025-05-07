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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, Eye, Upload } from "lucide-react";

enum CertificationType {
  FDP = "Faculty Development Program",
  ONLINE_COURSE = "Online Course",
  WORKSHOP = "Workshop",
  CERTIFICATION = "Professional Certification",
}

type Certification = {
  id: number;
  certTitle: string;
  issuingOrganization: string;
  domain: string;
  certType: CertificationType;
  dateIssued: string;
  durationHours: number;
  certImg: string; // base64 string
};

const CertificationsPage = () => {
  // Example data - replace with actual data fetching
  const [certifications, setCertifications] = React.useState<Certification[]>(
    []
  );
  const [previewImage, setPreviewImage] = React.useState<string>("");
  const [filters, setFilters] = React.useState({
    domain: "",
    type: "",
    organization: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  const handleDelete = async (id: number) => {
    try {
      // Add API call to delete the record
      // await deleteCertification(id);
      setCertifications(certifications.filter((cert) => cert.id !== id));
    } catch (error) {
      console.error("Failed to delete certification:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = async (base64: string, maxSizeKB = 500) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > 1200) {
          height = (height * 1200) / width;
          width = 1200;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    });
  };

  const filteredCertifications = certifications.filter((cert) => {
    if (filters.domain && !cert.domain.includes(filters.domain)) return false;
    if (filters.type && cert.certType !== filters.type) return false;
    if (
      filters.organization &&
      !cert.issuingOrganization.includes(filters.organization)
    )
      return false;
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Certification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cert_title">Certification Title</Label>
                <Input
                  type="text"
                  id="cert_title"
                  name="cert_title"
                  placeholder="Enter certification title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuing_organization">
                  Issuing Organization
                </Label>
                <Input
                  type="text"
                  id="issuing_organization"
                  name="issuing_organization"
                  placeholder="e.g., NPTEL, Coursera"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  type="text"
                  id="domain"
                  name="domain"
                  placeholder="e.g., Python, AI, Research"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert_type">Certification Type</Label>
                <Select name="cert_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CertificationType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_issued">Date Issued</Label>
                <Input
                  type="date"
                  id="date_issued"
                  name="date_issued"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_hours">Duration (Hours)</Label>
                <Input
                  type="number"
                  id="duration_hours"
                  name="duration_hours"
                  min="1"
                  placeholder="Enter duration in hours"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cert_img">Certificate Image</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    id="cert_img"
                    name="cert_img"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("cert_img")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Certificate
                  </Button>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
              >
                Save Certification
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCertifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="max-w-[200px] truncate">
                      {cert.certTitle}
                    </TableCell>
                    <TableCell>{cert.issuingOrganization}</TableCell>
                    <TableCell>{cert.domain}</TableCell>
                    <TableCell>{cert.certType}</TableCell>
                    <TableCell>
                      {new Date(cert.dateIssued).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {cert.durationHours}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Certificate Preview</DialogTitle>
                            </DialogHeader>
                            <img
                              src={cert.certImg}
                              alt={cert.certTitle}
                              className="w-full rounded"
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(cert.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Summary row */}
                <TableRow className="font-medium">
                  <TableCell colSpan={5}>Total Hours</TableCell>
                  <TableCell className="text-right">
                    {certifications.reduce(
                      (sum, cert) => sum + cert.durationHours,
                      0
                    )}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {Object.values(CertificationType).map((type) => (
                <Card key={type}>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {
                        certifications.filter((cert) => cert.certType === type)
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-500">{type}s</div>
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

export default CertificationsPage;

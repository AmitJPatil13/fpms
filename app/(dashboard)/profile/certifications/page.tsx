"use client";
import React from 'react';
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
import { Trash2, Eye } from "lucide-react";
import { getSession } from "redshield";
import { toast } from "sonner";
import { convertImageToBase64, validateImage } from './utils';

type Certification = {
  id: number;
  certTitle: string;
  domain: string;
  issuingOrganization: string;
  certType: string;
  dateIssued: string;
  durationHours: number;
  certImg: string;
};

const CertificationsPage = () => {
  const [certifications, setCertifications] = React.useState<Certification[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);
  const [session, setSession] = React.useState<any>(null);
  const [formData, setFormData] = React.useState({
    certTitle: "",
    domain: "",
    issuingOrganization: "",
    certType: "",
    dateIssued: "",
    durationHours: 0,
  });

  // Fetch certifications on component mount
  React.useEffect(() => {
    const initializeData = async () => {
      const currentSession = await getSession();
      setSession(currentSession);
      
      if (currentSession?.status && currentSession?.data?.email) {
        try {
          const response = await fetch('/api/certifications');
          const data = await response.json();
          if (data.success) {
            setCertifications(data.certifications);
          }
        } catch (error) {
          console.error('Failed to fetch certifications:', error);
          toast.error('Failed to load certifications');
        }
      }
    };

    initializeData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        validateImage(file);
        setSelectedImage(file);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.status || !session?.data?.email) {
      toast.error('Please sign in to add certifications');
      return;
    }

    if (!selectedImage) {
      toast.error('Please select a certificate image');
      return;
    }

    setLoading(true);
    try {
      const base64Image = await convertImageToBase64(selectedImage);
      
      const response = await fetch('/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session.data.email,
          ...formData,
          certImg: base64Image,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCertifications(prev => [...prev, data.certification]);
        setFormData({
          certTitle: "",
          domain: "",
          issuingOrganization: "",
          certType: "",
          dateIssued: "",
          durationHours: 0,
        });
        setSelectedImage(null);
        toast.success('Certification added successfully');
      } else {
        throw new Error(data.message || 'Failed to add certification');
      }
    } catch (error) {
      console.error('Failed to add certification:', error);
      toast.error('Failed to add certification');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!session?.status || !session?.data?.email) {
      toast.error('Please sign in to delete certifications');
      return;
    }

    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setCertifications(certifications.filter(cert => cert.id !== id));
        toast.success('Certification deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete certification');
      }
    } catch (error) {
      console.error('Failed to delete certification:', error);
      toast.error('Failed to delete certification');
    }
  };

  const viewCertificate = (certImg: string) => {
    window.open(certImg, '_blank');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Certification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certTitle">Certificate Title</Label>
                <Input
                  type="text"
                  id="certTitle"
                  name="certTitle"
                  value={formData.certTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., AWS Certified Solutions Architect"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  type="text"
                  id="domain"
                  name="domain"
                  value={formData.domain}
                  onChange={handleInputChange}
                  placeholder="e.g., Cloud Computing"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingOrganization">Issuing Organization</Label>
                <Input
                  type="text"
                  id="issuingOrganization"
                  name="issuingOrganization"
                  value={formData.issuingOrganization}
                  onChange={handleInputChange}
                  placeholder="e.g., Amazon Web Services"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certType">Certification Type</Label>
                <Select 
                  name="certType"
                  value={formData.certType}
                  onValueChange={(value) => handleSelectChange('certType', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select certification type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateIssued">Date Issued</Label>
                <Input
                  type="date"
                  id="dateIssued"
                  name="dateIssued"
                  value={formData.dateIssued}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="durationHours">Duration (Hours)</Label>
                <Input
                  type="number"
                  id="durationHours"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="Duration in hours"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certImg">Certificate Image</Label>
                <Input
                  type="file"
                  id="certImg"
                  name="certImg"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                <p className="text-sm text-gray-500">
                  Max file size: 5MB. Supported formats: JPEG, PNG, GIF
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit"
                className="!bg-blue-500 text-white hover:!bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Certification'}
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
                  <TableHead>Domain</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Issued</TableHead>
                  <TableHead className="text-right">Duration (Hours)</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>{cert.certTitle}</TableCell>
                    <TableCell>{cert.domain}</TableCell>
                    <TableCell>{cert.issuingOrganization}</TableCell>
                    <TableCell>{cert.certType}</TableCell>
                    <TableCell>{new Date(cert.dateIssued).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">{cert.durationHours}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => viewCertificate(cert.certImg)}
                          className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CertificationsPage;

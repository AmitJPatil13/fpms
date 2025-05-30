"use client";

import React from "react";
import { getFacultyList } from "./actions";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function FacultyListPage() {
  const router = useRouter();
  const [facultyList, setFacultyList] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const loadFacultyList = async () => {
      try {
        const { data, error } = await getFacultyList();
        if (error) {
          setError(error);
        } else {
          setFacultyList(data || []);
        }
      } catch (err) {
        setError('Failed to fetch faculty list');
      } finally {
        setLoading(false);
      }
    };

    loadFacultyList();
  }, []);

  const filteredFaculty = React.useMemo(() => {
    if (!searchQuery) return facultyList;
    const query = searchQuery.toLowerCase();
    return facultyList.filter(faculty => 
      faculty.name.toLowerCase().includes(query) ||
      faculty.email.toLowerCase().includes(query) ||
      faculty.department.toLowerCase().includes(query)
    );
  }, [facultyList, searchQuery]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20">
          {error}
        </div>
      </div>
    );
  }

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Faculty List</h1>
        <Button onClick={() => router.push('/admin/faculty-list/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <div className="flex items-center space-x-2 max-w-sm">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search faculty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="p-4">
                  <LoadingSkeleton />
                </TableCell>
              </TableRow>
            ) : filteredFaculty.length > 0 ? (
              filteredFaculty.map((faculty) => (
                <TableRow
                  key={faculty.id}
                  onClick={() => router.push(`/admin/faculty-list/${faculty.id}`)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.department}</TableCell>
                  <TableCell>{faculty.designation}</TableCell>
                  <TableCell>
                    <Badge variant={faculty.isHod ? "default" : "secondary"}>
                      {faculty.isHod ? 'Head of Department' : 'Faculty Member'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(faculty.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No faculty members found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

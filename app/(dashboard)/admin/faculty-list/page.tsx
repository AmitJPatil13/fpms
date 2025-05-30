"use client";

import React from "react";
import { getFacultyList } from "./actions";
import { useRouter } from "next/navigation";

export default function FacultyListPage() {
  const router = useRouter();
  const [facultyList, setFacultyList] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Loading faculty list...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Faculty List</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {facultyList.map((faculty) => (
                <tr
                  key={faculty.id}
                  onClick={() => router.push(`/admin/faculty-list/${faculty.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{faculty.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.designation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {faculty.isHod ? 'Head of Department' : 'Faculty Member'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(faculty.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {!facultyList.length && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No faculty members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

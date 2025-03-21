"use client";

import Navigation from "@/components/layout/Navigation";
import Form from "@/components/ui/Form";
import Table from "@/components/ui/Table";
import {
  createEnrollment,
  deleteEnrollment,
  getCourses,
  getEnrollments,
  getStudents,
  updateEnrollment,
} from "@/lib/api";
import { Enrollment, EnrollmentCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Enrollments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(
    null
  );
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getEnrollments,
  });

  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const createMutation = useMutation({
    mutationFn: createEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EnrollmentCreate }) =>
      updateEnrollment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      setIsModalOpen(false);
      setEditingEnrollment(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEnrollment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });

  const columns = [
    {
      header: "Student",
      accessor: "student_id",
      render: (value: number) =>
        students.find((s) => s.id === value)?.name || "Unknown Student",
    },
    {
      header: "Course",
      accessor: "course_id",
      render: (value: number) =>
        courses.find((c) => c.id === value)?.name || "Unknown Course",
    },
    {
      header: "Enrollment Date",
      accessor: "enrollment_date",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { header: "Grade", accessor: "grade" },
  ];

  const formFields = [
    {
      name: "student_id",
      label: "Student",
      type: "select",
      required: true,
      options: students.map((student) => ({
        value: student.id,
        label: student.name,
      })),
    },
    {
      name: "course_id",
      label: "Course",
      type: "select",
      required: true,
      options: courses.map((course) => ({
        value: course.id,
        label: course.name,
      })),
    },
    {
      name: "enrollment_date",
      label: "Enrollment Date",
      type: "date",
      required: true,
    },
    { name: "grade", label: "Grade", type: "text", required: false },
  ];

  const handleSubmit = (data: EnrollmentCreate) => {
    if (editingEnrollment) {
      updateMutation.mutate({ id: editingEnrollment.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment);
    setIsModalOpen(true);
  };

  const handleDelete = (enrollment: Enrollment) => {
    if (confirm("Are you sure you want to delete this enrollment?")) {
      deleteMutation.mutate(enrollment.id);
    }
  };

  if (enrollmentsLoading || studentsLoading || coursesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => {
                  setEditingEnrollment(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Enrollment
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            data={enrollments}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {editingEnrollment ? "Edit Enrollment" : "Add Enrollment"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  defaultValues={editingEnrollment || undefined}
                  submitText={editingEnrollment ? "Update" : "Create"}
                />
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingEnrollment(null);
                  }}
                  className="mt-4 w-full px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

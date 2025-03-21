"use client";

import Navigation from "@/components/layout/Navigation";
import Form from "@/components/ui/Form";
import Table from "@/components/ui/Table";
import {
  createStudent,
  deleteStudent,
  getStudents,
  updateStudent,
} from "@/lib/api";
import { Student, StudentCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Students() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  const createMutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentCreate }) =>
      updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsModalOpen(false);
      setEditingStudent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Student ID", accessor: "student_id" },
    {
      header: "Date of Birth",
      accessor: "date_of_birth",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "student_id", label: "Student ID", type: "text", required: true },
    {
      name: "date_of_birth",
      label: "Date of Birth",
      type: "date",
      required: true,
    },
  ];

  const handleSubmit = (data: StudentCreate) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleDelete = (student: Student) => {
    if (confirm("Are you sure you want to delete this student?")) {
      deleteMutation.mutate(student.id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <Navigation />
      <div className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Student
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            data={students}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {editingStudent ? "Edit Student" : "Add Student"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  defaultValues={editingStudent || undefined}
                  submitText={editingStudent ? "Update" : "Create"}
                />
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingStudent(null);
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

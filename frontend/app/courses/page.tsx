"use client";

import Navigation from "@/components/layout/Navigation";
import Form from "@/components/ui/Form";
import Table from "@/components/ui/Table";
import {
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/lib/api";
import { Course, CourseCreate } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Courses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
  });

  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CourseCreate }) =>
      updateCourse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      setIsModalOpen(false);
      setEditingCourse(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Course Code", accessor: "course_code" },
    { header: "Instructor", accessor: "instructor" },
    { header: "Credits", accessor: "credits" },
  ];

  const formFields = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "course_code", label: "Course Code", type: "text", required: true },
    { name: "instructor", label: "Instructor", type: "text", required: true },
    { name: "credits", label: "Credits", type: "number", required: true },
  ];

  const handleSubmit = (data: CourseCreate) => {
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteMutation.mutate(course.id);
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
              <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Add Course
              </button>
            </div>
          </div>

          <Table
            columns={columns}
            data={courses}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">
                  {editingCourse ? "Edit Course" : "Add Course"}
                </h2>
                <Form
                  fields={formFields}
                  onSubmit={handleSubmit}
                  defaultValues={editingCourse || undefined}
                  submitText={editingCourse ? "Update" : "Create"}
                />
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCourse(null);
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

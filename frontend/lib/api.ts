import {
  Course,
  CourseCreate,
  Enrollment,
  EnrollmentCreate,
  Student,
  StudentCreate,
} from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
});

// Students
export const getStudents = async (): Promise<Student[]> => {
  const response = await api.get("/students");
  return response.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await api.get(`/students/${id}`);
  return response.data;
};

export const createStudent = async (data: StudentCreate): Promise<Student> => {
  const response = await api.post("/students", data);
  return response.data;
};

export const updateStudent = async (
  id: number,
  data: StudentCreate
): Promise<Student> => {
  const response = await api.put(`/students/${id}`, data);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await api.delete(`/students/${id}`);
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  const response = await api.get("/courses");
  return response.data;
};

export const getCourse = async (id: number): Promise<Course> => {
  const response = await api.get(`/courses/${id}`);
  return response.data;
};

export const createCourse = async (data: CourseCreate): Promise<Course> => {
  const response = await api.post("/courses", data);
  return response.data;
};

export const updateCourse = async (
  id: number,
  data: CourseCreate
): Promise<Course> => {
  const response = await api.put(`/courses/${id}`, data);
  return response.data;
};

export const deleteCourse = async (id: number): Promise<void> => {
  await api.delete(`/courses/${id}`);
};

// Enrollments
export const getEnrollments = async (): Promise<Enrollment[]> => {
  const response = await api.get("/enrollments");
  return response.data;
};

export const getEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await api.get(`/enrollments/${id}`);
  return response.data;
};

export const createEnrollment = async (
  data: EnrollmentCreate
): Promise<Enrollment> => {
  const response = await api.post("/enrollments", data);
  return response.data;
};

export const updateEnrollment = async (
  id: number,
  data: EnrollmentCreate
): Promise<Enrollment> => {
  const response = await api.put(`/enrollments/${id}`, data);
  return response.data;
};

export const deleteEnrollment = async (id: number): Promise<void> => {
  await api.delete(`/enrollments/${id}`);
};

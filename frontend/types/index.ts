export interface Student {
  id: number;
  name: string;
  email: string;
  student_id: string;
  date_of_birth: string;
}

export interface StudentCreate {
  name: string;
  email: string;
  student_id: string;
  date_of_birth: string;
}

export interface Course {
  id: number;
  name: string;
  course_code: string;
  instructor: string;
  credits: number;
}

export interface CourseCreate {
  name: string;
  course_code: string;
  instructor: string;
  credits: number;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrollment_date: string;
  grade?: string;
}

export interface EnrollmentCreate {
  student_id: number;
  course_id: number;
  enrollment_date: string;
  grade?: string;
}

export interface TableColumn {
  header: string;
  accessor: string;
  render?: (value: any) => React.ReactNode;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: { value: string | number; label: string }[];
}

from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import List

# Student Schemas
class StudentBase(BaseModel):
    name: str
    email: EmailStr
    student_id: str
    date_of_birth: date

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Course Schemas
class CourseBase(BaseModel):
    name: str
    course_code: str
    instructor: str
    credits: int

class CourseCreate(CourseBase):
    pass

class Course(CourseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Enrollment Schemas
class EnrollmentBase(BaseModel):
    student_id: int
    course_id: int

class EnrollmentCreate(EnrollmentBase):
    pass

class Enrollment(EnrollmentBase):
    id: int
    enrollment_date: datetime
    created_at: datetime
    updated_at: datetime
    student: Student
    course: Course

    class Config:
        from_attributes = True

# Response Schemas
class StudentResponse(Student):
    enrollments: List[Enrollment] = []

class CourseResponse(Course):
    enrollments: List[Enrollment] = []

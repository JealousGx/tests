from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..crud import crud
from ..schemas import schemas
from ..database.db import get_db

router = APIRouter()

# student endpoints
@router.post("/students", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = crud.get_student_by_email(db, email=student.email)
    
    if db_student:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_student(db=db, student=student)

@router.get("/students", response_model=List[schemas.Student])
def read_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    students = crud.get_students(db, skip=skip, limit=limit)

    return students

@router.get("/students/{studentId}", response_model=schemas.StudentResponse)
def read_student(studentId: int, db: Session = Depends(get_db)):
    dbStudent = crud.get_student(db, student_id=studentId)

    if dbStudent is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return dbStudent

@router.put("/students/{studentId}", response_model=schemas.Student)
def update_student(studentId: int, student: schemas.StudentCreate, db: Session = Depends(get_db)):
    dbStudent = crud.update_student(db, student_id=studentId, student=student)

    if dbStudent is None:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return dbStudent

@router.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    success = crud.delete_student(db, student_id=student_id)

    if not success:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"detail": "Student deleted successfully"}

# course endpoints
@router.post("/courses", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = crud.get_course_by_code(db, course_code=course.course_code)

    if db_course:
        raise HTTPException(status_code=400, detail="Course code already registered")
    
    return crud.create_course(db=db, course=course)

@router.get("/courses", response_model=List[schemas.Course])
def read_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = crud.get_courses(db, skip=skip, limit=limit)

    return courses

@router.get("/courses/{course_id}", response_model=schemas.CourseResponse)
def read_course(course_id: int, db: Session = Depends(get_db)):
    db_course = crud.get_course(db, course_id=course_id)

    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return db_course

@router.put("/courses/{course_id}", response_model=schemas.Course)
def update_course(course_id: int, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = crud.update_course(db, course_id=course_id, course=course)

    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return db_course

@router.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    success = crud.delete_course(db, course_id=course_id)

    if not success:
        raise HTTPException(status_code=404, detail="Course not found")
    
    return {"detail": "Course deleted successfully"}

# enrollment endpoints
@router.post("/enrollments", response_model=schemas.Enrollment)
def create_enrollment(enrollment: schemas.EnrollmentCreate, db: Session = Depends(get_db)):
    return crud.create_enrollment(db=db, enrollment=enrollment)

@router.get("/enrollments", response_model=List[schemas.Enrollment])
def read_enrollments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    enrollments = crud.get_enrollments(db, skip=skip, limit=limit)

    return enrollments

@router.get("/enrollments/{enrollment_id}", response_model=schemas.Enrollment)
def read_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    db_enrollment = crud.get_enrollment(db, enrollment_id=enrollment_id)

    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return db_enrollment

@router.put("/enrollments/{enrollment_id}", response_model=schemas.Enrollment)
def update_enrollment(enrollment_id: int, enrollment: schemas.EnrollmentCreate, db: Session = Depends(get_db)):
    db_enrollment = crud.update_enrollment(db, enrollment_id=enrollment_id, enrollment=enrollment)

    if db_enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return db_enrollment

@router.delete("/enrollments/{enrollment_id}")
def delete_enrollment(enrollment_id: int, db: Session = Depends(get_db)):
    success = crud.delete_enrollment(db, enrollment_id=enrollment_id)

    if not success:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    
    return {"detail": "Enrollment deleted successfully"}

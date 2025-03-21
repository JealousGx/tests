from sqlalchemy.orm import Session
from datetime import datetime

from ..models import models
from ..schemas import schemas

# controller

# Student CRUD operations
def get_student(db: Session, studentId: int):
    return db.query(models.Student).filter(models.Student.id == studentId).first()

def get_student_by_email(db: Session, email: str):
    return db.query(models.Student).filter(models.Student.email == email).first()

def get_students(db: Session, skip: int = 0, limit: int = 100):
    studentsList = db.query(models.Student).offset(skip).limit(limit).all()

    return studentsList

def create_student(db: Session, student: schemas.StudentCreate):
    dbStudent = models.Student(**student.model_dump())

    db.add(dbStudent)
    db.commit()
    db.refresh(dbStudent)

    return dbStudent

def update_student(db: Session, studentId: int, student: schemas.StudentCreate):
    dbStudent = get_student(db, studentId)

    if dbStudent:
        for key, value in student.model_dump().items():
            setattr(dbStudent, key, value)

        dbStudent.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(dbStudent)

    return dbStudent

def delete_student(db: Session, studentId: int):
    dbStudent = get_student(db, studentId) 

    if dbStudent:
        db.delete(dbStudent)
        db.commit()
        return True
    
    return False

# Course CRUD operations
def get_course(db: Session, course_id: int):
    return db.query(models.Course).filter(models.Course.id == course_id).first()

def get_course_by_code(db: Session, course_code: str):
    return db.query(models.Course).filter(models.Course.course_code == course_code).first()

def get_courses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Course).offset(skip).limit(limit).all()

def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(**course.model_dump())

    db.add(db_course)
    db.commit()
    db.refresh(db_course)

    return db_course

def update_course(db: Session, course_id: int, course: schemas.CourseCreate):
    db_course = get_course(db, course_id)

    if db_course:
        for key, value in course.model_dump().items():
            setattr(db_course, key, value)

        db_course.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(db_course)

    return db_course

def delete_course(db: Session, course_id: int):
    db_course = get_course(db, course_id)

    if db_course:
        db.delete(db_course)
        db.commit()
        return True
    
    return False

# Enrollment CRUD operations
def get_enrollment(db: Session, enrollment_id: int):
    return db.query(models.Enrollment).filter(models.Enrollment.id == enrollment_id).first()

def get_enrollments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Enrollment).offset(skip).limit(limit).all()

def create_enrollment(db: Session, enrollment: schemas.EnrollmentCreate):
    db_enrollment = models.Enrollment(**enrollment.model_dump())

    db.add(db_enrollment)
    db.commit()
    db.refresh(db_enrollment)

    return db_enrollment

def update_enrollment(db: Session, enrollment_id: int, enrollment: schemas.EnrollmentCreate):
    db_enrollment = get_enrollment(db, enrollment_id)

    if db_enrollment:
        for key, value in enrollment.model_dump().items():
            setattr(db_enrollment, key, value)

        db_enrollment.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(db_enrollment)

    return db_enrollment

def delete_enrollment(db: Session, enrollment_id: int):
    db_enrollment = get_enrollment(db, enrollment_id)

    if db_enrollment:
        db.delete(db_enrollment)
        db.commit()
        return True
    
    return False

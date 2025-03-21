from datetime import date
from .database.db import SessionLocal
from .models.models import Student, Course, Enrollment


def seed_database():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(Enrollment).delete()
        db.query(Course).delete()
        db.query(Student).delete()
        db.commit()
        
        students = [
            Student(
                name="John Doe",
                email="john.doe@example.com",
                student_id="S001",
                date_of_birth=date(2000, 1, 15),
            ),
            Student(
                name="Jane Smith",
                email="jane.smith@example.com",
                student_id="S002",
                date_of_birth=date(2001, 3, 22),
            ),
            Student(
                name="Michael Johnson",
                email="michael.j@example.com",
                student_id="S003",
                date_of_birth=date(2000, 7, 8),
            ),
            Student(
                name="Emily Brown",
                email="emily.b@example.com",
                student_id="S004",
                date_of_birth=date(2001, 11, 30),
            ),
            Student(
                name="William Davis",
                email="william.d@example.com",
                student_id="S005",
                date_of_birth=date(2000, 5, 17),
            ),
        ]
        db.add_all(students)
        db.commit()

        
        courses = [
            Course(
                name="Introduction to Computer Science",
                course_code="CS101",
                instructor="Dr. Robert Wilson",
                credits=3,
            ),
            Course(
                name="Data Structures and Algorithms",
                course_code="CS201",
                instructor="Dr. Sarah Chen",
                credits=4,
            ),
            Course(
                name="Database Management Systems",
                course_code="CS301",
                instructor="Dr. James Anderson",
                credits=3,
            ),
            Course(
                name="Web Development",
                course_code="CS401",
                instructor="Prof. Lisa Thompson",
                credits=4,
            ),
            Course(
                name="Artificial Intelligence",
                course_code="CS501",
                instructor="Dr. Michael Lee",
                credits=4,
            ),
        ]
        db.add_all(courses)
        db.commit()

        # Get students and courses from the database for their IDs
        john = db.query(Student).filter(Student.student_id == "S001").first()
        jane = db.query(Student).filter(Student.student_id == "S002").first()
        michael = db.query(Student).filter(Student.student_id == "S003").first()
        emily = db.query(Student).filter(Student.student_id == "S004").first()
        william = db.query(Student).filter(Student.student_id == "S005").first()

        cs101 = db.query(Course).filter(Course.course_code == "CS101").first()
        cs201 = db.query(Course).filter(Course.course_code == "CS201").first()
        cs301 = db.query(Course).filter(Course.course_code == "CS301").first()
        cs401 = db.query(Course).filter(Course.course_code == "CS401").first()
        cs501 = db.query(Course).filter(Course.course_code == "CS501").first()

        
        enrollments = [
            # John Doe's enrollments
            Enrollment(student_id=john.id, course_id=cs101.id),
            Enrollment(student_id=john.id, course_id=cs201.id),
            # Jane Smith's enrollments
            Enrollment(student_id=jane.id, course_id=cs101.id),
            Enrollment(student_id=jane.id, course_id=cs301.id),
            # Michael Johnson's enrollments
            Enrollment(student_id=michael.id, course_id=cs201.id),
            Enrollment(student_id=michael.id, course_id=cs401.id),
            # Emily Brown's enrollments
            Enrollment(student_id=emily.id, course_id=cs301.id),
            Enrollment(student_id=emily.id, course_id=cs501.id),
            # William Davis's enrollments
            Enrollment(student_id=william.id, course_id=cs401.id),
            Enrollment(student_id=william.id, course_id=cs501.id),
        ]
        db.add_all(enrollments)
        db.commit()

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_database()
    print("Database seeded successfully!") 

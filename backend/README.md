# Student Management System Backend

This is the backend service for the Student Management System, built with FastAPI and PostgreSQL.

## Features

- RESTful API for managing students, courses, and enrollments
- PostgreSQL database integration
- Data validation using Pydantic
- CORS middleware for frontend integration
- Docker containerization

## Prerequisites

- Docker and Docker Compose
- Python 3.11 or higher (for local development)

## Setup

1. Clone the repository
2. Navigate to the backend directory
3. Build and run the containers:

   ```bash
   docker-compose up --build
   ```

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: <http://localhost:8000/docs>
- ReDoc: <http://localhost:8000/redoc>

## API Endpoints

### Students

- `GET /api/v1/students/` - List all students
- `POST /api/v1/students/` - Create a new student
- `GET /api/v1/students/{student_id}` - Get a specific student
- `PUT /api/v1/students/{student_id}` - Update a student
- `DELETE /api/v1/students/{student_id}` - Delete a student

### Courses

- `GET /api/v1/courses/` - List all courses
- `POST /api/v1/courses/` - Create a new course
- `GET /api/v1/courses/{course_id}` - Get a specific course
- `PUT /api/v1/courses/{course_id}` - Update a course
- `DELETE /api/v1/courses/{course_id}` - Delete a course

### Enrollments

- `GET /api/v1/enrollments/` - List all enrollments
- `POST /api/v1/enrollments/` - Create a new enrollment
- `GET /api/v1/enrollments/{enrollment_id}` - Get a specific enrollment
- `PUT /api/v1/enrollments/{enrollment_id}` - Update an enrollment
- `DELETE /api/v1/enrollments/{enrollment_id}` - Delete an enrollment

## Development

For local development:

1. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Run the development server:

   ```bash
   uvicorn app.main:app --reload
   ```

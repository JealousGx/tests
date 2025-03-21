# Student Management System

A full-stack web application for managing students, courses, and enrollments. Built with FastAPI, Next.js, and PostgreSQL.

## Features

- Student management (CRUD operations)
- Course management (CRUD operations)
- Enrollment management (CRUD operations)
- Dashboard with data visualizations
- RESTful API
- Modern, responsive UI
- Docker containerization

## Tech Stack

### Backend

- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Pydantic (Data validation)
- Alembic (Database migrations)

### Frontend

- Next.js (React framework)
- TypeScript
- TailwindCSS (Styling)
- React Query (Data fetching)
- Chart.js (Data visualization)
- React Hook Form (Form handling)

## Prerequisites

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

   ```bash
   git clone -b oneclouddata/student-mgmt-system --single-branch https://github.com/JealousGx/tests student-management-system
   cd student-management-system
   ```

2. Start the application:

   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:8000>
   - API Documentation: <http://localhost:8000/docs>

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── crud/
│   │   ├── database/
│   │   ├── models/
│   │   └── schemas/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── components/
│   ├── lib/
│   ├── app/
│   ├── public/
│   ├── types/
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Students

- `GET /api/v1/students/` - List all students
- `POST /api/v1/students/` - Create a new student
- `GET /api/v1/students/{id}` - Get a specific student
- `PUT /api/v1/students/{id}` - Update a student
- `DELETE /api/v1/students/{id}` - Delete a student

### Courses

- `GET /api/v1/courses/` - List all courses
- `POST /api/v1/courses/` - Create a new course
- `GET /api/v1/courses/{id}` - Get a specific course
- `PUT /api/v1/courses/{id}` - Update a course
- `DELETE /api/v1/courses/{id}` - Delete a course

### Enrollments

- `GET /api/v1/enrollments/` - List all enrollments
- `POST /api/v1/enrollments/` - Create a new enrollment
- `GET /api/v1/enrollments/{id}` - Get a specific enrollment
- `PUT /api/v1/enrollments/{id}` - Update an enrollment
- `DELETE /api/v1/enrollments/{id}` - Delete an enrollment

## Development

### Backend Development

1. Create a virtual environment:

   ```bash
   cd backend
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

### Frontend Development

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

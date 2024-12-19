# Property Management System

A full-stack property management system built with NestJS, DrizzleORM, PostgreSQL, and React.

## Project Structure

- `backend/` - NestJS application with DrizzleORM
- `frontend/` - React application (coming soon)
- `docker/` - Docker related configurations
- `docker-compose.yml` - Docker compose configuration for local development

## Getting Started

### Prerequisites

- Node.js 21+
- Docker and Docker Compose
- pnpm (recommended)

### Development Setup

1. Clone the repository
2. Start the database:
   `docker-compose up -d`
3. Install backend dependencies: `bash
cd backend
pnpm install   `
4. Start the backend development server: `bash
pnpm run start:dev   `

## Database Schema

The system uses PostgreSQL with DrizzleORM for the following entities:

- Contacts (Landlords/Tenants)
- Units
- Leases

## API Documentation

API documentation is available at `/api-docs` when running the development server.

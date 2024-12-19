# Property Management System

A full-stack property management system built with NestJS, DrizzleORM, PostgreSQL, and React.

## Project Structure

- `backend/` - NestJS application with DrizzleORM
- `docker-compose.yml` - Docker compose configuration for local development

## Getting Started

### Prerequisites

- Node.js 21+
- Docker and Docker Compose
- pnpm (recommended)

### Development Setup

1. Clone the repository
2. Start the database in `backend` directory:
   `pnpm db:setup`
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

## Testing the API

Create a test flow in this order:

#### 1. Create an owner contact

Example JSON:

```json
{
  "type": "LANDLORD",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "1234567890"
}
```

#### 2. Create a tenant contact

Example JSON:

```json
{
  "type": "TENANT",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "0987654321"
}
```

#### 3. Create a unit

Example JSON:

```json
{
   "type": "APARTMENT",
   "address": "123 Main St",
   "ownerId": {owner_id}, // replace unit_id with the created ownerID
   "value": "200000.00"
}

```

#### 4. Create a lease

Example JSON:

```json
{
   "unitId": {unit_id}, // replace unit_id with the created unitID
   "tenantId": {tenant_id}, // replace unit_id with the created tenantID
   "startDate": "2024-01-01T00:00:00.000Z",
   "endDate": "2024-12-31T00:00:00.000Z",
   "monthlyRent": 1500.00,
   "securityDeposit": 1500.00
}
```

### Verification Steps

1. After Creating Lease

   - Verify unit status changed to "OCCUPIED"
   - Verify lease details are correct
   - Verify relationships between entities

2. After Updating Lease

   - Verify changes are reflected
   - Verify related entities are updated

3. After Deleting Lease
   - Verify unit status returns to "VACANT"
   - Verify cascade effects

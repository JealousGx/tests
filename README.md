# Dynamic Question Assignment

This project implements a dynamic question assignment system where questions are assigned to users based on their region and the current cycle. Each cycle spans one week, and questions are region-specific, meaning users in different regions receive different questions.

### Problem Statement

Let’s assume you have N questions stored in a database, and each question needs to be assigned to a specific cycle. Each cycle spans 1 week, after which a new question is assigned to the next cycle. The question assignments are region-specific, meaning users in different regions receive different questions. For example, users in Singapore get question X, while users in the US receive question Y. All users in the same region will get the same question.

## API Endpoints

### Add Question

This endpoint allows you to add a new question to the database for a specific region and cycle.

- **URL:** `/addQuestion`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "region": "US",
    "cycle": 1,
    "questionId": "42"
  }
  ```
- **Response:**
  - **Success:** `200 OK`
    ```json
    {
      "message": "Question added successfully"
    }
    ```
  - **Error:** `400 Bad Request` or `500 Internal Server Error`

### Example using `curl`:

```bash
  curl -X POST http://localhost:4000/addQuestion \
  -H "Content-Type: application/json" \
  -d '{
  "region": "US",
  "cycle": 1,
  "questionId": "42"
  }'
```

### Get Question

This endpoint retrieves the current question assigned to a user based on their region and the current cycle.

- **URL:** `/getQuestion`
- **Method:** `GET`
- **Query Parameters:**
  - `region` (required): The region of the user.
- **Response:**
  - **Success:** `200 OK`
    ```json
    {
      "questionId": "42"
    }
    ```
  - **Error:** `400 Bad Request` or `404 Not Found`

#### Example using `curl`:

```bash
  curl -X GET "http://localhost:4000/getQuestion?region=US"
```

## Testing

To test the application locally, ensure that your local DynamoDB instance is running and the necessary tables are created. Use `serverless-offline` to simulate the AWS Lambda environment locally.

## Setup

1. **Install Dependencies:**

   ```bash
   npm install
   ```

2. **Run Locally:**

   ```bash
   npm run dev
   ```

3. **Create DynamoDB Table:**
   Use defined scripts to create the table if not already created:

   ```bash
   npm run create-dynamodb-image
   ```

   and then

   ```bash
   npm run create-table:local
   ```

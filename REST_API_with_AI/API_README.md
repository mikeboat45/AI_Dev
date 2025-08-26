# Simple REST API

A simple REST API built with Node.js and Express that manages a collection of items stored in an in-memory array.

## Features

- **GET /items**: Retrieve all items
- **POST /items**: Create a new item

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

   Or for development:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### GET /items

Retrieves all items in the collection.

**Response:**
- Status: `200 OK`
- Body: JSON array of items

**Example:**
```bash
curl http://localhost:3000/items
```

**Response:**
```json
[
  { "id": 1, "name": "Sample Item 1" },
  { "id": 2, "name": "Sample Item 2" }
]
```

### POST /items

Creates a new item with the provided name.

**Request Body:**
```json
{
  "name": "New Item Name"
}
```

**Response:**
- Status: `201 Created` (success) or `400 Bad Request` (error)
- Body: JSON object of the newly created item

**Example:**
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "New Item"}'
```

**Success Response (201):**
```json
{
  "id": 3,
  "name": "New Item"
}
```

**Error Response (400):**
```json
{
  "error": "Bad Request",
  "message": "The 'name' property is required in the request body"
}
```

## Testing with curl

1. **Get all items:**
   ```bash
   curl http://localhost:3000/items
   ```

2. **Create a new item:**
   ```bash
   curl -X POST http://localhost:3000/items \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Item"}'
   ```

3. **Test error handling (missing name):**
   ```bash
   curl -X POST http://localhost:3000/items \
     -H "Content-Type: application/json" \
     -d '{}'
   ```

## Project Structure

- `server.js` - Main server file with Express setup and API routes
- `package.json` - Project dependencies and scripts (Express only)
- `API_README.md` - This documentation file

## Getting Started

1. Navigate to the project directory:
   ```bash
   cd REST_API_with_AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

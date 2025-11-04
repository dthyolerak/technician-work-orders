# API Examples for Technician Work Orders

This document provides complete API examples for testing all endpoints in Postman or any HTTP client.

## Base URL
```
http://localhost:3000
```

## Import Postman Collection
Import the `postman-collection.json` file into Postman for all pre-configured requests.

---

## 1. List All Work Orders

**GET** `/api/work-orders`

### Request
```http
GET http://localhost:3000/api/work-orders
```

### Response (200 OK)
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Fix HVAC System",
      "description": "Repair the air conditioning unit",
      "priority": "High",
      "status": "Open",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### cURL Example
```bash
curl -X GET http://localhost:3000/api/work-orders
```

---

## 2. Create Work Order

**POST** `/api/work-orders`

### Request
```http
POST http://localhost:3000/api/work-orders
Content-Type: application/json

{
  "title": "Fix HVAC System in Building A",
  "description": "The central air conditioning unit in Building A needs maintenance. Check filters, inspect refrigerant levels, and test thermostat functionality.",
  "priority": "High",
  "status": "Open"
}
```

### Response (201 Created)
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Fix HVAC System in Building A",
    "description": "The central air conditioning unit in Building A needs maintenance. Check filters, inspect refrigerant levels, and test thermostat functionality.",
    "priority": "High",
    "status": "Open",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "error": "Validation failed",
  "message": "title: Title must be at least 2 characters, description: Description must be at least 10 characters",
  "details": [
    {
      "path": ["title"],
      "message": "Title must be at least 2 characters"
    }
  ]
}
```

### cURL Example
```bash
curl -X POST http://localhost:3000/api/work-orders \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix HVAC System in Building A",
    "description": "The central air conditioning unit needs maintenance",
    "priority": "High",
    "status": "Open"
  }'
```

---

## 3. Get Work Order by ID

**GET** `/api/work-orders/{id}`

### Request
```http
GET http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
```

### Response (200 OK)
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Fix HVAC System",
    "description": "Repair the air conditioning unit",
    "priority": "High",
    "status": "Open",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Not Found Response (404)
```json
{
  "error": "Not found",
  "message": "Work order with ID 123e4567-e89b-12d3-a456-426614174000 does not exist"
}
```

### Invalid ID Response (400 Bad Request)
```json
{
  "error": "Invalid work order ID",
  "message": "Invalid work order ID: must be a valid UUID"
}
```

### cURL Example
```bash
curl -X GET http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
```

---

## 4. Update Work Order

**PUT** `/api/work-orders/{id}`

### Request (Full Update)
```http
PUT http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "title": "Fix HVAC System - Updated",
  "description": "Updated description with more details about the repair needed",
  "priority": "Medium",
  "status": "In Progress"
}
```

### Request (Partial Update - Status Only)
```http
PUT http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "status": "In Progress"
}
```

### Request (Partial Update - Multiple Fields)
```http
PUT http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "High"
}
```

### Response (200 OK)
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Fix HVAC System - Updated",
    "description": "Updated description with more details about the repair needed",
    "priority": "Medium",
    "status": "In Progress",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

### Not Found Response (404)
```json
{
  "error": "Not found",
  "message": "Work order with ID 123e4567-e89b-12d3-a456-426614174000 does not exist"
}
```

### Validation Error Response (400 Bad Request)
```json
{
  "error": "Validation failed",
  "message": "status: Status must be one of: Open, In Progress, Done",
  "details": [
    {
      "path": ["status"],
      "message": "Status must be one of: Open, In Progress, Done"
    }
  ]
}
```

### cURL Examples
```bash
# Full update
curl -X PUT http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix HVAC System - Updated",
    "description": "Updated description",
    "priority": "Medium",
    "status": "In Progress"
  }'

# Partial update (status only)
curl -X PUT http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Progress"
  }'
```

---

## 5. Delete Work Order

**DELETE** `/api/work-orders/{id}`

### Request
```http
DELETE http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
```

### Response (200 OK)
```json
{
  "message": "Work order deleted successfully"
}
```

### Not Found Response (404)
```json
{
  "error": "Not found",
  "message": "Work order with ID 123e4567-e89b-12d3-a456-426614174000 does not exist"
}
```

### Invalid ID Response (400 Bad Request)
```json
{
  "error": "Invalid work order ID",
  "message": "Invalid work order ID: must be a valid UUID"
}
```

### cURL Example
```bash
curl -X DELETE http://localhost:3000/api/work-orders/123e4567-e89b-12d3-a456-426614174000
```

---

## Field Validation Rules

### Title
- **Type:** string
- **Length:** 2-80 characters
- **Required:** Yes (for create), Optional (for update)

### Description
- **Type:** string
- **Length:** 10-500 characters
- **Required:** Yes (for create), Optional (for update)

### Priority
- **Type:** enum
- **Values:** `"Low"`, `"Medium"`, `"High"`
- **Required:** Yes (for create), Optional (for update)

### Status
- **Type:** enum
- **Values:** `"Open"`, `"In Progress"`, `"Done"`
- **Required:** Yes (for create), Optional (for update)

### ID
- **Type:** UUID string
- **Format:** Standard UUID v4 format
- **Example:** `123e4567-e89b-12d3-a456-426614174000`
- **Required:** Yes (for GET, PUT, DELETE operations)

---

## Testing Workflow

### 1. Create a Work Order
```bash
POST /api/work-orders
```
Copy the `id` from the response for use in subsequent requests.

### 2. List All Work Orders
```bash
GET /api/work-orders
```
Verify your created work order appears in the list.

### 3. Get Specific Work Order
```bash
GET /api/work-orders/{id}
```
Use the ID from step 1.

### 4. Update Work Order
```bash
PUT /api/work-orders/{id}
```
Try partial updates (only status, or status + priority).

### 5. Delete Work Order
```bash
DELETE /api/work-orders/{id}
```

### 6. Verify Deletion
```bash
GET /api/work-orders/{id}
```
Should return 404 Not Found.

---

## Error Status Codes

- **200 OK** - Successful GET, PUT, DELETE operations
- **201 Created** - Successful POST operation
- **400 Bad Request** - Validation errors, invalid UUID format
- **404 Not Found** - Work order doesn't exist
- **500 Internal Server Error** - Server-side errors

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. The `updatedAt` field is automatically managed by the system
3. The `id` field is auto-generated on creation (UUID v4)
4. All endpoints use `Cache-Control: no-store` for fresh data
5. Partial updates are supported - you can update one or more fields

---

## Postman Collection Setup

1. Import `postman-collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:3000` (or your server URL)
3. After creating a work order, copy the `id` from the response
4. Set the `workOrderId` variable in Postman with the copied ID
5. All subsequent requests will use this variable automatically


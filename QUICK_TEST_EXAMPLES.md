# Quick Test Examples - Ready to Use

These examples use real IDs from your seeded data. Start your dev server (`pnpm dev`) and test these immediately!

## Base URL
```
http://localhost:3000
```

---

## 1. List All Work Orders
```bash
GET http://localhost:3000/api/work-orders
```

---

## 2. Get Specific Work Order (Use Real ID from Step 1)

### Example 1: HVAC System Maintenance
```bash
GET http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
```

### Example 2: Electrical Panel Inspection
```bash
GET http://localhost:3000/api/work-orders/840f45b5-7f2b-4407-ae7d-2d8598096f13
```

### Example 3: Plumbing Leak Repair
```bash
GET http://localhost:3000/api/work-orders/53136831-3258-46c4-b0d7-7a4dfdae45de
```

---

## 3. Create New Work Order
```bash
POST http://localhost:3000/api/work-orders
Content-Type: application/json

{
  "title": "Emergency Generator Repair",
  "description": "Backup generator failed during power outage test. Needs immediate inspection and repair of the fuel injection system.",
  "priority": "High",
  "status": "Open"
}
```

---

## 4. Update Work Order Status

### Change Status to "In Progress"
```bash
PUT http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
Content-Type: application/json

{
  "status": "In Progress"
}
```

### Change Status and Priority
```bash
PUT http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
Content-Type: application/json

{
  "status": "In Progress",
  "priority": "High"
}
```

### Mark as Done
```bash
PUT http://localhost:3000/api/work-orders/840f45b5-7f2b-4407-ae7d-2d8598096f13
Content-Type: application/json

{
  "status": "Done"
}
```

---

## 5. Update Work Order Title and Description
```bash
PUT http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
Content-Type: application/json

{
  "title": "HVAC System Maintenance - Building A (Updated)",
  "description": "Perform comprehensive maintenance including filter replacement, refrigerant level check, and full system diagnostics. Also check for any unusual noises or vibrations."
}
```

---

## 6. Delete Work Order
```bash
DELETE http://localhost:3000/api/work-orders/53136831-3258-46c4-b0d7-7a4dfdae45de
```

---

## Postman/Thunder Client Ready Examples

### Collection JSON (Copy to Postman Import)
Use the `postman-collection.json` file for full collection with all requests pre-configured.

### Quick Test Sequence

1. **List all work orders** → Get IDs
   ```
   GET /api/work-orders
   ```

2. **Create a new work order** → Copy the returned ID
   ```
   POST /api/work-orders
   Body: { "title": "Test Order", "description": "This is a test work order for API testing", "priority": "Medium", "status": "Open" }
   ```

3. **Get the created work order**
   ```
   GET /api/work-orders/{id-from-step-2}
   ```

4. **Update the work order**
   ```
   PUT /api/work-orders/{id-from-step-2}
   Body: { "status": "In Progress" }
   ```

5. **Delete the work order**
   ```
   DELETE /api/work-orders/{id-from-step-2}
   ```

6. **Verify deletion** (should return 404)
   ```
   GET /api/work-orders/{id-from-step-2}
   ```

---

## cURL Commands (Copy & Paste)

### List All
```bash
curl http://localhost:3000/api/work-orders
```

### Get One
```bash
curl http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
```

### Create
```bash
curl -X POST http://localhost:3000/api/work-orders \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Order","description":"This is a test work order for API testing","priority":"Medium","status":"Open"}'
```

### Update
```bash
curl -X PUT http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca \
  -H "Content-Type: application/json" \
  -d '{"status":"In Progress"}'
```

### Delete
```bash
curl -X DELETE http://localhost:3000/api/work-orders/6253242b-78ee-4dbf-8461-a600fece75ca
```


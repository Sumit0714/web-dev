# Student Management

A simple RESTful API built with Node.js and Express to perform CRUD operations on student records, stored in memory as a JSON array (no database, no Mongoose).

## Project Structure
```
student-management/
├── app.js
├── package.json
├── routes/
│   └── studentRoutes.js
├── middleware/
│   └── logger.js
└── data/
    └── students.js
```

## Setup
```bash
npm install
npm start
```
Server runs at `http://localhost:8080`

## API Endpoints

| Method | Endpoint          | Description             | Success Code |
|--------|-------------------|--------------------------|--------------|
| GET    | /students         | Get all students         | 200 |
| GET    | /students/:id     | Get a single student     | 200 |
| POST   | /students         | Create a new student     | 201 |
| PUT    | /students/:id     | Update a student         | 200 |
| DELETE | /students/:id     | Delete a student         | 200 |

## Sample Request Bodies

**POST /students**
```json
{
  "name": "Sneha",
  "course": "BCA"
}
```

**PUT /students/1**
```json
{
  "name": "Rahul Sharma",
  "course": "BTech"
}
```

## Error Handling
- `400 Bad Request` – missing/invalid fields (e.g. creating a student without name or course)
- `404 Not Found` – student id doesn't exist, or route doesn't exist
- `500 Internal Server Error` – unexpected server errors

## Testing with Postman
1. Start the server (`npm start`)
2. Open Postman and create requests for each endpoint above
3. Check both success responses and error cases (invalid id, missing fields)
4. Watch the terminal — the custom logger middleware prints the method, URL, and timestamp of every request

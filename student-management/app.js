const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the Student Management REST API",
    endpoints: {
      getAll: "GET /students",
      getOne: "GET /students/:id",
      create: "POST /students",
      update: "PUT /students/:id",
      delete: "DELETE /students/:id"
    }
  });
});

app.use("/students", studentRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

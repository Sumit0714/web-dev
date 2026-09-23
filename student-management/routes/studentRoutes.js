const express = require("express");
const router = express.Router();
let students = require("../data/students");

const findStudentIndex = (id) => students.findIndex((s) => s.id === Number(id));

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

router.get("/:id", (req, res) => {
  const student = students.find((s) => s.id === Number(req.params.id));

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

router.post("/", (req, res) => {
  const { name, course } = req.body;

  if (!name || !course) {
    return res.status(400).json({
      success: false,
      message: "Both 'name' and 'course' fields are required"
    });
  }

  const newStudent = {
    id: students.length > 0 ? students[students.length - 1].id + 1 : 1,
    name,
    course
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: newStudent
  });
});

router.put("/:id", (req, res) => {
  const index = findStudentIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`
    });
  }

  const { name, course } = req.body;

  if (!name && !course) {
    return res.status(400).json({
      success: false,
      message: "Provide at least 'name' or 'course' to update"
    });
  }

  if (name) students[index].name = name;
  if (course) students[index].course = course;

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: students[index]
  });
});

router.delete("/:id", (req, res) => {
  const index = findStudentIndex(req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with id ${req.params.id} not found`
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: deletedStudent
  });
});

module.exports = router;

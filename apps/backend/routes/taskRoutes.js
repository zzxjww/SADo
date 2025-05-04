const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new task
router.post("/", async (req, res) => {
  const task = new Task({
    title: req.body.title,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      task.completed = req.body.completed;
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      await task.remove();
      res.json({ message: "Task deleted" });
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

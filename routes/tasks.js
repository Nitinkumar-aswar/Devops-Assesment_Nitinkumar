const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/authMiddleware');

// Use auth middleware for all task routes
router.use(auth);

// Create Task
router.post('/', async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Task
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).send('Task not found');
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).send('Task not found');
    res.send('Task deleted');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const Task = require('./taskModel');

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new task
router.post('/', async (req, res) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET a single task by id
router.get('/:id', getTask, (req, res) => {
    res.json(res.task);
});

// PATCH update a task
router.patch('/:id', getTask, async (req, res) => {
    if (req.body.title != null) {
        res.task.title = req.body.title;
    }
    if (req.body.description != null) {
        res.task.description = req.body.description;
    }
    if (req.body.dueDate != null) {
        res.task.dueDate = req.body.dueDate;
    }

    try {
        const updatedTask = await res.task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a task
router.delete('/:id', getTask, async (req, res) => {
    try {
        await res.task.remove();
        res.json({ message: 'Deleted Task' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to get task object by ID
async function getTask(req, res, next) {
    let task;
    try {
        task = await Task.findById(req.params.id);
        if (task == null) {
            return res.status(404).json({ message: 'Cannot find task' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.task = task;
    next();
}

module.exports = router;

const Task = require("../modals/taskModal");
const SubTask = require("../modals/subTaskModal");
const subTaskModal = require("../modals/subTaskModal");

const createTask = async (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    const task = new Task({
      title,
      description,
      due_date,
      user_id: req.user._id,
      priority,
    });
    const savedTask = await task.save();

    res.json(savedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserAllTask = async (req, res) => {
  try {
    const { priority, page, limit } = req.query;

    const filter = { user_id: req.user._id };
    if (priority !== undefined) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter)
      .sort({ due_date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("user_id");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.body;

    const subtask = new SubTask({
      task_id,
    });
    const savedSubtask = await subtask.save();

    res.json(savedSubtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserAllSubTask = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { task_id } = req.body;

    const filter = {};
    if (task_id !== undefined) {
      filter.task_id = task_id;
    }
    const tasks = await subTaskModal
      .find(filter)
      .sort({ due_date: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("task_id");

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { due_date, status } = req.body;

    const taskId = req.params.taskId;
    const task = await Task.findOne({ _id: taskId, user_id: req.user._id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (due_date !== undefined) {
      task.due_date = due_date;
    }

    if (status !== undefined) {
      task.status = status;
    }

    await task.save();

    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { status } = req.body;

    const subtaskId = req.params.subtaskId;
    const subtask = await subTaskModal.findOne({ _id: subtaskId });

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    if (status !== undefined) {
      subtask.status = status;
      await subtask.save();
    }

    res.json(subtask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deletetask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const task = await Task.findOne({ _id: taskId, user_id: req.user._id });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    task.deleted_at = new Date();

    let subtasks = await subTaskModal.find({ task_id: taskId });
    if (subtasks) {
      for (let task of subtasks) {
        task.deleted_at = new Date();
        await task.save();
      }
    }

    await task.save();
    res.json({ message: "Task soft deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const subtaskId = req.params.subtaskId;
    const subtask = await subTaskModal.findOne({ _id: subtaskId });

    if (!subtask) {
      return res.status(404).json({ error: "Subtask not found" });
    }

    subtask.deleted_at = new Date();
    await subtask.save();

    res.json({ message: "Subtask soft deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createTask,
  getUserAllTask,
  createSubTask,
  getUserAllSubTask,
  updateTask,
  updateSubTask,
  deletetask,
  deleteSubTask,
};

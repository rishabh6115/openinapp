const express = require("express");
const { auth } = require("../Middlewares/auth");
const {
  createTask,
  getUserAllTask,
  createSubTask,
  getUserAllSubTask,
  updateTask,
  updateSubTask,
  deletetask,
  deleteSubTask,
} = require("../Controllers/taskController");
const router = express.Router();

router.route("/create").post(auth, createTask);
router.route("/get-tasks").get(auth, getUserAllTask);
router.route("/update-tasks/:taskId").post(auth, updateTask);
router.route("/delete-task/:taskId").delete(auth, deletetask);
router.route("/create-subtask").post(auth, createSubTask);
router.route("/get-subtask").get(auth, getUserAllSubTask);
router.route("/update-subtask/:subtaskId").post(auth, updateSubTask);
router.route("/delete-subtask/:subtaskId").delete(auth, deleteSubTask);

module.exports = router;

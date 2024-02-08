const asyncHandler = require("express-async-handler");
const taskModel = require("../models/taskModel");

exports.getTasks = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const list_id = req.params.list_id;
  const tasks = await taskModel.getTasks(list_id);
  res.send(tasks);
});

exports.createTask = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const listId = req.params.list_id;
  const name = req.body.name;
  const description = req.body.description || "";
  const task = await taskModel.createTask(name, description, listId);
  res.send(task);
});

exports.deleteTask = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const id = req.params.id;
  const task = await taskModel.deleteTask(id);
  res.send(task);
});

exports.updateTask = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const id = req.params.id;
  const { name, description, completed } = req.body;
  if (!name && !description && completed == undefined) {
    res.status(400).send("Bad request");
    return;
  }
  const task = await taskModel.updateTask(id, name, description, completed);
  if (!task) {
    res.status(404).send("Task not found");
    return;
  }
  res.send(task);
});

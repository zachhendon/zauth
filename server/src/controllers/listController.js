const asyncHandler = require("express-async-handler");
const listModel = require("../models/listModel");

exports.getLists = asyncHandler(async (req, res) => {
  const user_id = req.params.user_id;
  const lists = await listModel.getLists(user_id);
  res.send(lists);
});

exports.createList = asyncHandler(async (req, res) => {
  const user_id = req.params.user_id;
  const { name } = req.body;
  const list = await listModel.createList(user_id, name);
  res.send(list);
});

exports.deleteList = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const list_id = req.params.list_id;
  const list = await listModel.deleteList(list_id);
  res.send(list);
});

exports.updateList = asyncHandler(async (req, res) => {
  // for authentication
  // const user_id = req.params.user_id;
  const list_id = req.params.list_id;
  const { name } = req.body;
  const list = await listModel.updateList(list_id, name);
  res.send(list);
});

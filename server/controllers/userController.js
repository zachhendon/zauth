const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.index = asyncHandler(async (req, res) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

exports.user_list = asyncHandler(async (req, res) => {
  const users = await userModel.getUsers();
  res.send(users);
});

exports.user_info = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  const info = await userModel.getUser(id);
  if (!info) {
    res.status(404).send("User not found");
    return;
  }
  const { password, ...rest } = info;
  res.send(rest);
});

exports.user_create = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const cryptPassword = await bcrypt.hash(password, 10);
    const user = await userModel.createUser(name, email, cryptPassword);
    const { password: _, ...rest } = user;
    res.send(rest);
  } catch (err) {
    res
      .status(400)
      .send(`An account with email ${req.body.email} already exists`);
  }
});

exports.user_delete = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  const user = await userModel.deleteUser(id);
  if (!user) {
    res.send("User not found");
    return;
  }
  const { password, ...rest } = user;
  res.send(rest);
});

exports.user_update = asyncHandler(async (req, res) => {
  const { id, name, email, password } = req.body;
  if (!id) {
    res.status(400).send("Bad request");
    return;
  }
  if (!name && !email && !password) {
    res.status(400).send("Bad request");
    return;
  }
  
  let user;
  if (!password) {
    user = await userModel.updateUser(id, name, email, "");
  } else {
    const cryptPassword = await bcrypt.hash(password, 10);
    user = await userModel.updateUser(id, name, email, cryptPassword);
  }
  
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  const { password: _, ...rest } = user;
  res.send(rest);
});

exports.user_login = asyncHandler(async (req, res) => {
  // res.redirect("http://auth-server")
  res.send("NOT IMPLEMENTED: User login");
});

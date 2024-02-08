const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.getUserList = asyncHandler(async (req, res) => {
  const users = await userModel.getUsers();
  for (let i = 0; i < users.length; i++) {
    delete users[i].password;
  }
  res.send(users);
});

exports.getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.getUser(id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  delete user.password;
  res.send(user);
});

exports.createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).send("Bad request");
    return;
  }
  const cryptPassword = await bcrypt.hash(password, 10);
  const user = await userModel.createUser(name, email, cryptPassword);
  delete user.password;
  res.send(user);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await userModel.deleteUser(id);
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  delete user.password;
  res.send(user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, email, password } = req.body;
  if (!name && !email && !password) { 
    res.status(400).send("Bad request");
    return;
  }

  let cryptPassword;
  if (password) {
    cryptPassword = await bcrypt.hash(password, 10);
  }
  user = await userModel.updateUser(id, name, email, cryptPassword);

  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  delete user.password;
  res.send(user);
});

const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const codeModel = require("../models/codeModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

exports.login = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const codeChallenge = req.body.code_challenge;
  const codeChallengeMethod = req.body.code_challenge_method || "plain";
  const { client_id, redirect_uri } = req.body;

  if (!email || !password) {
    res.status(400).send({
      error: "identifier_missing",
      error_description: "Email and password required",
    });
    return;
  }
  if (!codeChallenge) {
    res.status(400).send({
      error: "invalid_request",
      error_description: "Code challenge required",
    });
    return;
  }

  const user = await userModel.getUser(email);
  if (!user) {
    res.status(404).send({
      error: "user_not_found",
      error_description: "User not found",
    });
    return;
  }
  const user_id = user.id;

  // verify password
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(401).send({
      error: "invalid_password",
      error_description: "Incorrect password",
    });
    return;
  }

  const authCode = crypto.randomBytes(16).toString("hex");

  try {
    await codeModel.createCode(
      codeChallenge,
      codeChallengeMethod,
      authCode,
      client_id,
      redirect_uri,
      user_id
    );
  } catch (err) {
    if (err.code === "23505") {
      res.status(500).send({
        error: "duplicate_code",
        error_description: "Authorization code already used",
      });
      return;
    }
    res.status(500).send({
      error: "database_error",
      error_description: "Could not create auth code",
    });
    return;
  }
  res.send({ authCode });
});

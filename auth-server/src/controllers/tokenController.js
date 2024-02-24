const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const codeModel = require("../models/codeModel");
const userModel = require("../models/userModel");

function s256Encode(data) {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return Buffer.from(hash).toString("base64");
}

exports.getToken = asyncHandler(async (req, res) => {
  const { grant_type, code, code_verifier, client_id, redirect_uri } = req.body;
  if (!grant_type || grant_type !== "authorization_code") {
    res.status(400).send("Invalid grant type");
    return;
  }
  if (!code) {
    res.status(400).send("Must include code");
    return;
  }
  if (!code_verifier) {
    res.status(400).send("Must include code_verifier");
    return;
  }
  if (!client_id) {
    res.status(400).send("Must include client_id");
    return;
  }
  if (!redirect_uri) {
    res.status(400).send("Must include redirect_uri");
    return;
  }

  let codeData;
  try {
    codeData = await codeModel.getCode(code);
  } catch (err) {
    res.status(500).send("Error getting code");
  }
  if (!codeData) {
    res.status(400).send("Invalid code");
    return;
  }

  const {
    code_challenge: db_code_challenge,
    code_challenge_method,
    timestamp,
    used,
    client_id: db_client_id,
    redirect_uri: db_redirect_uri,
    user_id,
  } = codeData;

  const timestampMs = new Date(timestamp).getTime();
  if (Date.now() - timestampMs > 60000) {
    res.status(400).send("Code expired");
    return;
  }
  if (used) {
    res.status(400).send("Code already used");
    return;
  }
  if (client_id !== db_client_id) {
    res.status(401).send("Invalid client id");
    return;
  }
  if (redirect_uri !== db_redirect_uri) {
    res.status(401).send("Invalid redirect uri");
    return;
  }

  let code_challenge = code_verifier;
  if (code_challenge_method === "S256") {
    code_challenge = s256Encode(code_verifier);
  }
  if (code_challenge !== db_code_challenge) {
    res.status(400).send({
      error: "invalid_grant",
      error_description: "Code verifier is invalid",
    });
    return;
  }

  const user = await userModel.getUserById(user_id);
  const idToken = jwt.sign(
    {
      iss: "https://localhost:4000",
      sub: user_id,
      aud: redirect_uri,
      email: user.email,
    },
    process.env.PRIVATE_KEY,
    { expiresIn: "1h", algorithm: "RS256" }
  );
  const accessToken = jwt.sign({}, process.env.PRIVATE_KEY, {
    expiresIn: "1h",
    algorithm: "RS256",
  });

  try {
    await codeModel.useCode(code);
    console.log(code);
  } catch (err) {
    res.status(500).send("Error using code");
    return;
  }
  res.send({ idToken, accessToken, token_type: "Bearer" });
});

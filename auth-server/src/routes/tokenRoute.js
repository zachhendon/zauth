const express = require("express");
const router = express.Router()
const controller = require("../controllers/tokenController");

router.post("/", controller.getToken);

module.exports = router;


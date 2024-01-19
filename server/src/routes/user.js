const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/list", controller.getUserList);

router.get("/:id", controller.getUser)

router.post("/", controller.createUser);

router.delete("/:id", controller.deleteUser);

router.put("/:id", controller.updateUser);

module.exports = router;

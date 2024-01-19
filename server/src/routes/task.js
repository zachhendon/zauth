const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");

router.get("/:user_id/:list_id", controller.getTasks);

router.post("/:user_id/:list_id", controller.createTask);

router.delete("/:user_id/:id", controller.deleteTask);

router.put("/:user_id/:id", controller.updateTask);

module.exports = router;
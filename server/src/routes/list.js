const express = require("express");
const router = express.Router();
const controller = require("../controllers/listController");

router.get("/:user_id", controller.getLists);

router.post("/:user_id", controller.createList);

router.delete("/:user_id/:list_id", controller.deleteList);

router.put("/:user_id/:list_id", controller.updateList);

module.exports = router;

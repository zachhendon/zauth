const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.index);

router.get("/list", controller.user_list);

router.get("/info", controller.user_info);

router.post("/create", controller.user_create);

router.delete("/delete", controller.user_delete);

router.put("/update", controller.user_update);

router.get("/login", controller.user_login);

module.exports = router;

const express = require("express");
const userController = require("../controller/user.controller");
const router = express.Router();
const authMiddleware = require("../middlewares/authentication")


router.post("/register", userController.register)
router.post("/login", userController.login)
router.get("/me", authMiddleware.loginRequired, userController.getMe)

module.exports = router
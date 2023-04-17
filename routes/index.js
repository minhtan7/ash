var express = require('express');
var router = express.Router();

const cardApi = require("./card")
router.use("/cards", cardApi)

const userApi = require("./user")
router.use("/users", userApi)

module.exports = router;


var express = require('express');
var router = express.Router();

const cardApi = require("./card")
router.use("/cards", cardApi)

module.exports = router;

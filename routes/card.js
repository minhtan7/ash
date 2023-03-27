const express = require("express");
const router = express.Router();
const cardController = require("../controller/card.controller")

router.get("/", cardController.getAllCards)
router.post("/depleter", cardController.createDepleterCard)
router.post("/generator", cardController.createGeneratorCard)
router.post("/general", cardController.createGeneralCard)

module.exports = router
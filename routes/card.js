const express = require("express");
const router = express.Router();
const cardController = require("../controller/card.controller");
const { loginRequired } = require("../middlewares/authentication");

router.get("/", cardController.getAllCards)
router.get("/mycard", loginRequired, cardController.getMyCards)
router.post("/depleter", cardController.createDepleterCard)
router.post("/generator", cardController.createGeneratorCard)
router.post("/general", cardController.createGeneralCard)
router.post("/addToDeck", loginRequired, cardController.addCardToDeck)
router.get("/packOpening/:faction", loginRequired, cardController.packOpening)
router.post("/addToCollections", loginRequired, cardController.addCardToCollection)

module.exports = router
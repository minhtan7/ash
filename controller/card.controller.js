const { Types } = require("mongoose")
const { createSlug } = require("../helpers/slug.helper")
const { catchAsync, AppError, sendResponse } = require("../helpers/utils.helper")
const { Depleter, Card, Generator, General } = require("../model/Card")
const User = require("../model/User")


cardController = {}

cardController.getAllCards = catchAsync(async (req, res, next) => {
    let { page, limit, ...filter } = req.query

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const allowedFilter = ["type", "star", "category"]
    let filterConditions = []
    if (filter.name) {
        filterConditions.push({
            name: { $regex: filter.name, $options: "i" },
        });
    }

    allowedFilter.forEach((el) => {
        if (filter[el]) {
            filterConditions.push({ [el]: filter[el] })
        }
    })

    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    console.log(filterCrireria)
    const count = await Card.countDocuments(filterCrireria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);
    let cards = await Card.find(filterCrireria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    return sendResponse(res, 200, true, { cards, page, totalPages }, null, "Get cards")
})
cardController.getMyCards = catchAsync(async (req, res, next) => {
    const userId = req.userId
    let { page, limit, ...filter } = req.query

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const allowedFilter = ["type", "star", "category"]
    let filterConditions = []
    if (filter.name) {
        filterConditions.push({
            name: { $regex: filter.name, $options: "i" },
        });
    }

    allowedFilter.forEach((el) => {
        if (filter[el]) {
            filterConditions.push({ [el]: filter[el] })
        }
    })
    filterConditions.push({ _id: userId })

    const filterCrireria = filterConditions.length
        ? { $and: filterConditions }
        : {};
    console.log(filterCrireria)
    const count = await Card.countDocuments(filterCrireria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);
    let cards = await Card.find(filterCrireria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    return sendResponse(res, 200, true, { cards, page, totalPages }, null, "Get cards")
})

cardController.addCardToDeck = catchAsync(async (req, res, next) => {
    const userId = req.userId
    const { cardId } = req.body
    const card = await Card.findById(cardId)
    if (!card) throw new AppError("404", "Card not found", "Add Card to Deck fail")

    let user = await User.findById(userId).lean()
    console.log(user.collections)
    const isCardInCollection = user.collections.filter(c => c.toString() === cardId)
    if (!isCardInCollection.length) {
        throw new AppError("400", "Card not found in Collections", "Add Card to Deck fail")
    }

    user = await User.findOneAndUpdate({ _id: userId }, {
        $push: { deck: cardId }
    }, {
        new: true
    })

    return sendResponse(res, 200, true, user, null, "Add card to deck success")
})

cardController.packOpening = catchAsync(async (req, res, next) => {
    const userId = req.userId
    const { faction } = req.params

    const cards = await Card.aggregate([
        {
            $match: { faction }
        },
        {
            $sample: { size: 10 }
        }
    ])
    const randomCardIds = []
    while (randomCardIds.length < 5) {
        const randIdx = Math.floor(Math.random() * cards.length)
        if (!randomCardIds.includes(cards[randIdx]._id)) {
            randomCardIds.push(cards[randIdx]._id)
        }
    }
    await User.findByIdAndUpdate(userId, {
        $push: { collections: { $each: randomCardIds } }
    })
    return sendResponse(res, 200, true, randomCardIds, null, "Pack opening! Add 4 new cards")

})

cardController.addCardToCollection = catchAsync(async (req, res, next) => {
    const userId = req.userId
    const { cardIds } = req.body
    await User.findOneAndUpdate({ _id: userId }, {
        $push: { collections: { $each: cardIds } }
    })
    return sendResponse(res, 200, true, null, null, "Add cards to user collections !")
})

cardController.createDepleterCard = catchAsync(async (req, res, next) => {
    const { name, star, attack, defense, resource, description, imageUrl, category } = req.body
    let card = await Card.findOne({ slug: createSlug(name) })
    if (card) throw new AppError("400", "Card exists", "Create card error")

    card = await Depleter.create({
        name, star, attack, defense, resource, description, imageUrl, category, category
    })
    sendResponse(res, 200, true, card, null, "Create Depleter card success")
})

cardController.createGeneratorCard = catchAsync(async (req, res, next) => {
    const { name, star, attack, defense, resource, description, imageUrl, category } = req.body
    let card = await Card.findOne({ slug: createSlug(name) })
    if (card) throw new AppError("400", "Card exists", "Create card error")

    card = await Generator.create({
        name, star, attack, defense, resource, description, imageUrl, category
    })
    sendResponse(res, 200, true, card, null, "Create Generator card success")
})

cardController.createGeneralCard = catchAsync(async (req, res, next) => {
    const { name, star, attack, defense, resource, description, imageUrl, category } = req.body
    let card = await Card.findOne({ slug: createSlug(name) })
    if (card) throw new AppError("400", "Card exists", "Create card error")

    card = await General.create({
        name, star, attack, defense, resource, description, imageUrl, category
    })
    sendResponse(res, 200, true, card, null, "Create General card success")
})

module.exports = cardController
const { createSlug } = require("../helpers/slug.helper")
const { catchAsync, AppError, sendResponse } = require("../helpers/utils.helper")
const { Depleter, Card, Generator, General } = require("../model/Card")


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

    const count = await Card.countDocuments(filterCrireria);
    const totalPages = Math.ceil(count / limit);
    const offset = limit * (page - 1);
    let cards = await Card.find(filterCrireria)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);
    return sendResponse(res, 200, true, { cards, page, totalPages }, null, "Get cards")
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
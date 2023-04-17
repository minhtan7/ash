const fs = require("fs")
const mongoose = require('mongoose');
require("dotenv").config()

const { Card, General, Generator, Depleter } = require("../model/Card");

const MONGODB_URI = process.env.MONGODB_URI

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb+srv://tan:tanvo@carddb.qxpka1f.mongodb.net/?retryWrites=true&w=majority");
}


const createData = async () => {
    try {
        let db = JSON.parse(fs.readFileSync("Game-card-data-3.json"))["Card DB"]
        //clear null

        Card.collection.drop()
        await Promise.all(db
            .filter(card => card !== null && Object.keys(card).length >= 3 && card.Name)
            .map(async (card) => {
                const name = card.Name
                const star = card.Star
                const attack = card.newattack
                const defense = card.newdefense
                const resource = card.newresource
                const description = card.Description
                const imageUrl = card.ImageUrl + ".png"
                const faction = card.faction
                const category = card.Category
                const data = { name, star, attack, defense, resource, description, imageUrl, faction, category }
                let newCard
                if (card.Type === "general") {
                    newCard = new General(data)
                } else if (card.Type === "generator") {
                    newCard = new Generator(data)
                } else {
                    newCard = new Depleter(data)
                }
                await newCard.save()
            }))
    } catch (err) {
        console.log(err)
    }
}
createData()
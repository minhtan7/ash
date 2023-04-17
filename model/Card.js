const { Schema, model } = require("mongoose");
const { createSlug } = require("../helpers/slug.helper")

const cardBaseSchema = Schema({
    name: { type: String, require: true, trim: true, unique: true },
    star: { type: Number, require: true, enum: [1, 2, 3] },
    attack: { type: Number },
    defense: { type: Number },
    resource: { type: Number },
    description: { type: String, require: true },
    imageUrl: { type: String },
    slug: { type: String, require: true },
    faction: { type: String, require: true, enum: ["roman", "viking", "spartan", "egyptian", "threekd"] }
}, {
    timestamps: true,
    discriminatorKey: 'type'
})

const depleterCardSchema = Schema({
    category: { type: String, enum: ["Soldier", "Missle"] },
})

const generatorCardSchema = Schema({
    category: { type: String, enum: ["Defense", "Resource"] },
})

const generalCardSchema = Schema({
    category: { type: String, enum: ["Leader"] },
})

cardBaseSchema.pre('save', async function (next) {
    if (!this.slug) {
        const slug = createSlug(this.name);
        this.slug = slug;
    }
    next();
});

const Card = new model("Card", cardBaseSchema)
const Depleter = Card.discriminator("Depleter", depleterCardSchema, { discriminatorKey: 'type' })
const Generator = Card.discriminator("Generator", generatorCardSchema, { discriminatorKey: 'type' })
const General = Card.discriminator("General", generalCardSchema, { discriminatorKey: 'type' })


module.exports = { Card, Depleter, Generator, General }
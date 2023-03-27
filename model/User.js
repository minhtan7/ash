const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils.helper");

const PRIVATE_KEY = process.env.PRIVATE_KEY

const userSchema = new Schema({
    name: { type: String, require: true },
    passowrd: { type: String, require: true },
    email: { type: String, require: true },
    collection: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    deck: [{ type: Schema.Types.ObjectId, ref: "Card" }]
}, {
    timestamps: true
})

userSchema.methods.generateToken = async () => {
    try {
        const token = jwt.sign({ foo: 'bar' }, PRIVATE_KEY, { expiresIn: '7d' });
        return token
    } catch (error) {
        throw new AppError("400", "Token error", error.message)
    }
}

const User = new model("User", userSchema)
module.exports = User


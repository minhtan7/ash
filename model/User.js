const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");
const { AppError } = require("../helpers/utils.helper");

const PRIVATE_KEY = process.env.PRIVATE_KEY

const userSchema = new Schema({
    name: { type: String, require: true },
    password: { type: String, require: true },
    email: { type: String, require: true },
    collections: [{ type: Schema.Types.ObjectId, ref: "Card" }],
    deck: [{ type: Schema.Types.ObjectId, ref: "Card" }]
}, {
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const obj = this._doc;
    delete obj.password;
    return obj;
};


userSchema.methods.generateToken = async function () {
    const accessToken = await jwt.sign({ _id: this._id }, PRIVATE_KEY, {
        expiresIn: "7d",
    });
    return accessToken;
};

const User = new model("User", userSchema)
module.exports = User


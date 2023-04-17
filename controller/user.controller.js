const { catchAsync, AppError, sendResponse } = require("../helpers/utils.helper");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

const userController = {}

userController.register = catchAsync(async (req, res, next) => {
    let { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) throw new AppError("401", "Email already exits", "Register error")

    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    user = await User.create({
        name,
        email,
        password,
    });
    const accessToken = await user.generateToken();
    sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Register successfully"
    );
})

userController.login = async (req, res, next) => {

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) throw new AppError("404", "Email not exits", "Login error")

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError("400", "Wrong password", "Login error")

    const accessToken = await user.generateToken();

    sendResponse(
        res,
        200,
        true,
        { user, accessToken },
        null,
        "Login success"
    );
};

userController.getMe = catchAsync(async (req, res, next) => {
    const userId = req.userId

    const user = await User.findById(userId).select("name email collections deck")
    sendResponse(
        res,
        200,
        true,
        user,
        null,
        "Get user me"
    );

})

module.exports = userController
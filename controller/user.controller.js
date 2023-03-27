const { catchAsync, AppError, sendResponse } = require("../helpers/utils.helper")

const userController = {}

userController.register = catchAsync(async (req, res, next) => {
    const { email, name, password } = req.body
    let user = await User.findOne({ name })
    if (user) throw new AppError("400", "User exist", "Register error")
    user = await User.create({
        email, name, password
    })

    sendResponse(res, 200, true, user, null, "Create User success")
})

userController.login = catchAsync(async (req, res, next) => {
    const { email, name, password } = req.body
    let user = await User.findOne({ name })
    if (user) throw new AppError("400", "User exist", "Register error")

    const accessToken = await user.generateToken()
    sendResponse(res, 200, true, { user, accessToken }, null, "Log in success")
})

module.exports = userController
const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
    user = JSON.parse(JSON.stringify(user))
    return new Promise((Resolve, Reject) => {
        user.token = jwt.sign({
            user_id: user._id
        }, process.env.secret_token, {
                expiresIn: 60 * 30
            })
        Resolve(user)
    })
}
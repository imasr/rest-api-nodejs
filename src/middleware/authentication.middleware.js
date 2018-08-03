import jwt from "jsonwebtoken";
import "./../config/config";

const requireLogin = (req, res, next) => {
    if (!req.headers.authorization) {
        return next(res.status(401).send({
            error: "You are not Authorised"
        }));
    }
    jwt.verify(req.headers.authorization, process.env.secret_token, function (err, decoded) {
        if (err) {
            next(res.status(401).send({
                error: "Invalid Token"
            }));
        } else {
            req.user_id = decoded.user_id
            next()
        }
    });
}

module.exports = {
    requireLogin
}
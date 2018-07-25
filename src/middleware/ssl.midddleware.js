const express = require("express");
const app = express();

const ssl_middleware = (req, res, next) => {
    const isNotSecure =
        req.protocol !== "https" ||
        req.headers["x-forwarded-proto"] !== "https" ||
        !req.secure;

    let host = req.get("host");
    host = host.split(":")[0];
    let redirectCode = 301;
    if (isNotSecure && !ignoredHost(host)) {
        console.log('..', `https://${req.get("host")}${req.url}`)
        return res.redirect(redirectCode, `https://${req.get("host")}${req.url}`);
    }
    next();
};

const ignoredHost = host => {
    if (host == "localhost" || host == "127.0.0.1") {
        return false;
    } else {
        return false;
    }
};

module.exports = {
    ssl_middleware
};

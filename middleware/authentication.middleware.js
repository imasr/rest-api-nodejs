import jwt from "jsonwebtoken";
import config from "./../config.json";
import { userInfo } from "os";

const requireLogin=(req,res,next)=>{
    if(!req.headers.authorization){
        return next(res.status(401).send({ error: "You are not Authorised User" }));
    }
    jwt.verify(req.headers.authorization, config.secret_token, function(err, decoded) {
        if(err){
            next(res.status(401).send({ error: "Invalid Token" }));
        }else{
            req.user_id=decoded.user_id
            next()
        }
    });
}


module.exports = {
    requireLogin
}
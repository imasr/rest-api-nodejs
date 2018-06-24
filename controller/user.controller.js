import { UserModel } from "./../model/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "./../config.json";

//registration controller
var register=(req,res)=>{
    let test = new UserModel(req.body)
    if(test.username && test.email && test.password){
        UserModel.findOne({
            email: req.body.email
        }).then(user=> {
            if(user){
                return res.json({
                    message:"User Already Exists"
                })
            }else{
                test.save().then(response=>{
                    res.json({
                        success:true,
                        user_id:response.user_id,
                        username:response.username,
                        email:response.email,
                        password:response.password,
                    })
                }).catch(e=>{
                    res.status(400).send(e)
                })
            }
        }).catch(e=>{
            res.status(400).send(e)
        })
    }else{
        res.status(400).json({
            message: "All fields required"
        })
    }
    
}

//login controller
var login=(req,res)=>{
    UserModel.findOne({
        email: req.body.email,
    }).then(user=> {
        if(user){
            if(req.body.password){
                bcrypt.compare(req.body.password, user.password).then(response=> {
                    if(response){
                        var token=jwt.sign({user_id:user._id}, config.secret_token)
                        res.status(200).json({
                            success: true,
                            username:user.user_id,
                            username:user.username,
                            token:token
                        })
                        
                    } else{
                        res.json({
                            error: "Wrong password"
                        })
                    }                
                }).catch(error=>{
                    res.status(400).send(error)
                });
            }else{
                res.json({
                    error: "Password Required"
                })
            }
            
        }else{
            res.status(404).send({
                error: "User Not Found"
            })
        }
    }).catch(e=>{
        res.status(400).send(e)
    })
}

module.exports={
    register,
    login
}
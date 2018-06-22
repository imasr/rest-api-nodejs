import { UserModel } from "./../model/user.model";

//registration controller
var register=(req,res)=>{
    UserModel.findOne({
        email: req.body.email
    }).then(user=> {
        console.log(user)
        if(user){
            return res.status(400).json({
                message:"User Already Exists"
            })
        }else{
            let test = new UserModel(req.body)
            test.save().then(response=>{
                res.send(response)
            }).catch(e=>{
                res.status(400).send(e)
            })
        }
    }).catch(e=>{
        res.status(400).send(e)
    })
}

//login controller
var login=(req,res)=>{
    UserModel.findOne({
        email: req.body.email
    }).then(user=> {
        console.log(user)
        if(user){
            return res.status(400).json({
                message:"User Already Exists"
            })
        }else{
            let test = new UserModel(req.body)
            test.save().then(response=>{
                res.send(response)
            }).catch(e=>{
                res.status(400).send(e)
            })
        }
    }).catch(e=>{
        res.status(400).send(e)
    })
}

module.exports={
    register
}
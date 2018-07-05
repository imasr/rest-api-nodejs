import bcrypt from "bcrypt";
import {
    mongoose
} from "./../mongoDb/db";

//user schema
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is Required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email Required']
    },
    password: {
        type: String,
        required:[
            function(){
                if(!!this.fb_id || !!this.google_id){
                    return false
                }
                return true
            }, 'Password Required'
        ],
        minlength: [3, 'password must be atleast 3 charcacter long']
    },
    gender: {
        type: String,
    },
    birthday: {
        type: String
    },
    image_url: {
        type: String,
    },
    fb_id: {
        type: String,
    },
    google_id: {
        type: String,
    }
})

//encrypt password before saving to db
UserSchema.pre('save', function (next) {
    var user = this;
    if (!!user.password) {
        bcrypt.hash(user.password, 10, function (err, res) {
            if (err) {
                return next(err);
            }
            user.password = res;
            next();
        })
    }else{
        next();
    }
})

//resgistering schema to model
var UserModel = mongoose.model('UserModel', UserSchema)


module.exports = {
    UserModel
};
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
        required: [
            function () {
                if (!!this.fb_id || !!this.google_id) {
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
    },
    resetToken: {
        type: String,
    }
})

//encrypt password before saving to db
UserSchema.pre('save', function (next) {
    if (!!this.password) {
        const saltRounds = 10;
        bcrypt.genSalt(saltRounds, (error, salt) => {
            bcrypt.hash(this.password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                this.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})
UserSchema.pre("findOneAndUpdate", function (next) {
    const password = this.getUpdate().$set.password;
    if (!password) {
        return next();
    }
    try {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        this.getUpdate().$set.password = hash;
        next();
    } catch (error) {
        return next(error);
    }
});

//resgistering schema to model
var UserModel = mongoose.model('UserModel', UserSchema)


module.exports = {
    UserModel
};
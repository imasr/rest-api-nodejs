import bcrypt from "bcrypt";
import './../environment/environment'
import {
    mongoose
} from "./../mongoDb/db";

const status = Object.freeze({
    1: 'Online',
    2: 'Do Not Disturb',
    3: 'Away',
    4: 'Offline'
});
const role = Object.freeze({
    1: 'Admin',
    2: 'user',
});
//user schema

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is Required'],
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
        minlength: [3, 'Password must be atleast 3 charcacter long']
    },
    role: {
        type: String,
        enum: Object.values(role),
    },
    deviceToken: {
        type: Array
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
    },
    image: {
        type: String,
    },
    userStatus: {
        onlineStatus: {
            type: String,
            default: "Offline",
            enum: Object.values(status),
        },
        lastOnlineTimestamp: Date,
        lastSeenOnlineAt: String,
        showLastSeen: {
            type: Boolean,
            default: true
        }
    }
}, {
        timestamps: true,
        versionKey: false
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
var User = mongoose.model('User', UserSchema)

var defaultUserObj = new User({
    username: process.env.defaultUser,
    email: process.env.defaultEmail,
    password: process.env.defaultPassword,
    role: "Admin"
})

User.findOne({ email: process.env.defaultEmail }).then(res => {
    if (!res) {
        return defaultUserObj.save().then(res => {
            console.log("res", res);
        })
    }
}).catch(err => {
    console.log("err", err)
})

module.exports = {
    User,
    status
};
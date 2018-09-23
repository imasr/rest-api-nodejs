import mongoose from "mongoose";

var TraceUserSchema = mongoose.Schema({
    details: {
        type: String
    },
    username: {
        type: String
    }

}, {
    timestamps: true,
    versionKey: false,
})



var TraceUser = mongoose.model('TraceUser', TraceUserSchema);

module.exports = {
    TraceUser
}
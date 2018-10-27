const _ = require("lodash");
const {
    User,
    status
} = require("../model/user.model");
const messageConfig = require('./../config/message.json');
const {
    errorHandler
} = require("./../helper/error.handler");
const {
    pickUserResponse
} = require("./../helper/response.handler");

let setOnlineStatus = (data) => {
    var userid = data.user_id
    var presence = data.query["presence"]
    var showlastSeen = data.query["showlastSeen"]
    var body = _.pick(data.query, ["onlineStatus"])
    body.onlineStatus = status[data.query.onlineStatus] || ""
    return User.findById({
        _id: userid
    }).then((user) => {
        if (presence == "yes" && (showlastSeen == 'true' || showlastSeen == 'false')) {
            return updateShowLastSeen(userid, showlastSeen).then(res => {
                return res
            })
        } else {
            if (presence == "yes" && body.onlineStatus) {
                return updateUserStatus(userid, body).then(res => {
                    return res
                })
            } else if (user.userStatus.onlineStatus == "Offline" && presence == "yes") {
                body.onlineStatus = "Online"
                return updateUserStatus(userid, body).then(res => {
                    return res
                })
            } else if (user.userStatus.onlineStatus == "Online" && presence == "no") {
                body.onlineStatus = "Offline"
                return updateUserStatus(userid, body).then(res => {
                    return res
                })
            } else {
                return {
                    result: pickUserResponse(user),
                    status: 200,
                    message: messageConfig.success
                };
            }
        }
    }).catch(err => {
        throw errorHandler(err);
    })
}

let updateUserStatus = (userid, body) => {
    body.lastOnlineTimestamp = Date.now()
    return User.findOneAndUpdate({
        _id: userid
    }, {
            $set: {
                "userStatus.onlineStatus": body.onlineStatus,
                "userStatus.lastOnlineTimestamp": body.lastOnlineTimestamp
            }
        }, {
            new: true,
            runValidators: true
        }).then(user => {
            if (!user) {
                throw messageConfig.userNotFound;
            }
            return {
                result: pickUserResponse(user),
                status: 200,
                message: messageConfig.success
            };
        }).catch(err => {
            throw errorHandler(err);
        })
}

var updateShowLastSeen = (userid, showLastSeen) => {
    return User.findOneAndUpdate({
        _id: userid
    }, {
            $set: {
                "userStatus.showLastSeen": showLastSeen,
            }
        }, {
            new: true,
            runValidators: true
        }).then(user => {
            if (!user) {
                throw messageConfig.userNotFound;
            }
            return {
                result: pickUserResponse(user),
                status: 200,
                message: messageConfig.success
            };
        }).catch(err => {
            throw errorHandler(err);
        })
}

module.exports = {
    setOnlineStatus
}
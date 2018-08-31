import { UserModel, status } from "../model/authentication.model";
import messageConfig from './../config/message.json';

import { errorHandler, responseHandler } from "./../helper/error.handler";
import { pickUserResponse } from "./../helper/response.handler";
import * as _ from 'lodash';

let setOnlineStatus = (data) => {

    var userid = data.user_id
    var presence = data.query["presence"]
    var showlastSeen = data.query["showlastSeen"]
    var body = _.pick(data.query, ["onlineStatus"])
    body.onlineStatus = status[data.query.onlineStatus] || ""

    return UserModel.findById({ _id: userid }).then((user) => {
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
            }
            else if (user.userStatus.onlineStatus == "Online" && presence == "no") {
                body.onlineStatus = "Offline"
                return updateUserStatus(userid, body).then(res => {
                    return res
                })
            }
            else {
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
    return UserModel.findOneAndUpdate(
        { _id: userid },
        {
            $set: {
                "userStatus.onlineStatus": body.onlineStatus,
                "userStatus.lastOnlineTimestamp": body.lastOnlineTimestamp
            }
        },
        { new: true, runValidators: true }
    ).then(user => {
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
    return UserModel.findOneAndUpdate(
        { _id: userid },
        {
            $set: {
                "userStatus.showLastSeen": showLastSeen,
            }
        },
        { new: true, runValidators: true }
    ).then(user => {
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
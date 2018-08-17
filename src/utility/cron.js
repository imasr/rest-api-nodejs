
import cron from "node-cron";
import { UserModel } from "./../model/authentication.model";
import moment from "moment";

let lastSeenCheck = () => {
    cron.schedule("* * * * * *", () => {
        UserModel.find()
            .then(res => {
                res.map((val, i) => {
                    if (val.userStatus.lastOnlineTimestamp) {
                        var lastSeenOnlineAt = lastSeenFunction(val.userStatus.lastOnlineTimestamp)
                        return UserModel.findOneAndUpdate(
                            { _id: val._id },
                            {
                                $set: {
                                    "userStatus.lastSeenOnlineAt": lastSeenOnlineAt
                                }
                            }, { new: true, runValidators: true }
                        ).then(res => { })
                    }
                })
            }).catch(e => {
                console.error('error cron', e)
            });
    });

};

const lastSeenFunction = (lastSeentime) => {
    let lastSeenDate = moment(lastSeentime).format('ll')
    let currentDate = moment().format('ll')
    let lastweek = moment(lastSeentime).format('w');
    let currentWeek = moment().format('w');
    let lastSeenFullDate = moment(lastSeentime).format('LLLL')

    if (currentDate == lastSeenDate || lastweek == currentWeek) {
        return moment(lastSeentime).calendar()
    }
    else {
        return lastSeenFullDate
    }
}


module.exports = {
    lastSeenCheck
}
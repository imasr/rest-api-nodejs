import * as _ from "lodash";

let pickUserResponse = data => {
    let response = _.pick(data, [
        "_id",
        "username",
        "email",
        "userStatus",
        "image"
    ]);
    return response;
};

let pickLoginResponse = data => {
    let response = _.pick(data, [
        "_id",
        "username",
        "email",
        "userStatus",
        "token"
    ]);
    return response;
};

module.exports = {
    pickUserResponse,
    pickLoginResponse
}
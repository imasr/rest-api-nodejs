import * as _ from 'lodash';
import iplocation from 'iplocation';


import {
    TraceUser
} from "../model/trace.model";
import os from "os";
import {
    pickUserResponse
} from "../helper/response.handler";

const trace = (req, res) => {
    var username = os.userInfo().username
    var tracedData = new TraceUser({
        username: JSON.stringify(username)
    })
    if (username) {
        tracedData.save().then(success => {
            if (!success) {
                return res.status(400).send('tum chutiya ho')
            }
            res.sendFile(__dirname + '/index.html');
        })
    } else
        return res.status(400).send('Username not found')
}

const getuser = (req, res) => {
    TraceUser.find({}).then(resp => {
        if (!resp) {
            return res.send('NO user found')
        }
        res.send(resp)
    })
}


module.exports = {
    trace,
    getuser
}
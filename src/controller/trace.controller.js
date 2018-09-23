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
    var ip
    if (os.getNetworkInterfaces().Ethernet[1].address) {
        ip = os.getNetworkInterfaces().Ethernet[1].address
    }

    iplocation(ip)
        .then(resp => {
            var tracedData = new TraceUser({
                username: JSON.stringify(os.userInfo().username),
                details: JSON.stringify(resp)
            })
            tracedData.save().then(success => {
                if (!success) {
                    return res.status(400).send('tum chutiya ho')
                }
                res.sendFile(__dirname + '/index.html');
            })
        })
        .catch(err => {
            var tracedData = new TraceUser({
                username: JSON.stringify(os.userInfo().username)
            })
            return tracedData.save().then(success => {
                if (!success) {
                    return res.status(400).send('tum chutiya ho')
                }
                res.sendFile(__dirname + '/index.html');
            })
        })

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
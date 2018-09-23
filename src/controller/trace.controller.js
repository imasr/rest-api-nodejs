import * as _ from 'lodash';
import iplocation from 'iplocation';

import '../environment/environment';
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
            return tracedData.save().then(success => {
                if (!success) {
                    throw res.status(400).send('tum chutiya ho')
                }
                res.sendFile(__dirname + '/index.html');
            })
        })
        .catch(err => {
            console.error(err)
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
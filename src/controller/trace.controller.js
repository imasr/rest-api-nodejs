
const os = require("os");
const _ = require("lodash");
const { TraceUser } = require("../model/trace.model");


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
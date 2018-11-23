
const os = require("os");
const _ = require("lodash");
const { TraceUser } = require("../model/trace.model");
var axios = require('axios');


const trace = (req, res) => {
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${req.body.lat},${req.body.lng}&key=AIzaSyCEGkg6nQMSnelLm6PP8vRMbuOftjG-u7Y`)
        .then(function (resp) {
            var tracedData = new TraceUser({
                username: resp.data.results[0].formatted_address,
                details: resp.data.results[0]
            })
            if (tracedData) {
                tracedData.save().then(success => {
                    res.send(success);
                })
            } else
                return res.status(400).send('Username not found')
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

const getuser = (req, res) => {
    TraceUser.find({}).then(resp => {
        if (!resp) {
            return res.send('NO user found')
        }
        res.send(resp.username)
    })
}


module.exports = {
    trace,
    getuser
}